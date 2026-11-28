/**
 * Article -> HTML for the WeChat Official Account editor.
 *
 * The editor keeps inline styles and little else: no stylesheet, classes,
 * ids, pseudo-elements, positioning, scripts or outside media, and links work
 * only inside WeChat. So the rendered article is copied in three steps:
 *
 *   1. prepare()  rewrites what WeChat cannot show at all into plain
 *      elements with wx-* classes: images, players and diagrams become
 *      upload placeholders, links become numbered references, tabs and
 *      details open up, checkboxes become drawn boxes.
 *   2. The copy is laid out off screen in the light scheme, where
 *      components/wechat.css restyles it for WeChat (.prose[data-wechat]).
 *   3. build()  reads the computed style of every element and writes it as
 *      inline styles on a new, class-free tree.
 *
 * Step 3 is generic, so a site's own colors and CSS carry over without a
 * second set of styles to maintain.
 *
 * The result follows WeChat's rules for third-party editor content (checked
 * with its verify-article-structure tool): no font-family, no line-height
 * below the font size, no text-align: start or end, no width set in px
 * except a table in a scrolling wrapper marked data-ignore-width, <pre> only
 * around code and scrolling sideways, and no positioning, gradients or
 * !important.
 *
 * The editor also rebuilds what is pasted (wrapLines() answers the one case
 * that changes the layout), so a change here is finished only when a pasted
 * article has been read back from WeChat.
 */
import { formatColor, parseColor, toPlainColor, veil } from "./wechat-color.js";

/** Elements that never reach WeChat (media are replaced in prepare()). */
const SKIP = new Set([
  "audio", "button", "canvas", "dialog", "embed", "iframe", "img", "input", "link", "meta", "noscript",
  "object", "picture", "rp", "script", "select", "source", "style", "svg", "template", "textarea", "video",
]);

/** Tags kept as they are; everything else becomes <section> or <span>. */
const KEEP = new Set([
  "a", "b", "blockquote", "br", "code", "del", "em", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i", "li", "ol",
  "p", "pre", "s", "span", "strong", "sub", "sup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "u", "ul",
]);

const INLINE_TAGS = new Set(["a", "b", "br", "code", "del", "em", "i", "s", "span", "strong", "sub", "sup", "u"]);
const TABLE_TAGS = new Set(["table", "tbody", "td", "tfoot", "th", "thead", "tr"]);
/** Blocks that hold a line of text themselves. */
const TEXT_BLOCKS = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p", "pre"]);
/** Blocks in which the editor accepts only other blocks (see wrapLines()). */
const LINE_HOLDERS = new Set(["li", "td", "th"]);

/**
 * Inherited properties are written only where they change, except on tags
 * that WeChat (or the browser) styles by itself: there the value is always
 * written, so the default never shows through.
 *
 * font-family is left out on purpose. WeChat's rules for editor content ask
 * for no font family at all: its own font stack is tuned per device, and a
 * second stack shows up as uneven sizes and spacing on some iOS versions.
 * <code> and <pre> keep their tags, so code is still set in each device's
 * monospace font.
 */
const INHERITED = [
  "color", "font-size", "font-style", "font-weight", "letter-spacing", "line-height",
  "list-style-type", "text-align", "white-space", "word-break",
];
const HEADING = ["font-size", "font-weight", "line-height"];
const ALWAYS = {
  b: ["font-weight"],
  code: ["font-size"],
  em: ["font-style"],
  h1: HEADING, h2: HEADING, h3: HEADING, h4: HEADING, h5: HEADING, h6: HEADING,
  i: ["font-style"],
  ol: ["list-style-type"],
  pre: ["font-size"],
  strong: ["font-weight"],
  sub: ["font-size", "line-height"],
  sup: ["font-size", "line-height"],
  td: ["text-align", "word-break"],
  th: ["font-weight", "text-align", "word-break"],
  ul: ["list-style-type"],
};
/** What WeChat's own stylesheet gives the article root. */
const WECHAT_ROOT = {
  "font-style": "normal",
  "font-weight": "400",
  "white-space": "normal",
  "word-break": "normal",
};
/** WeChat's text column on the narrowest phones in use (320px wide), in px. */
const NARROWEST_COLUMN = 288;
/** The most a table asks for (px) when it has to scroll on a phone. */
const TABLE_COMFORT = 640;
/** Tags whose box WeChat styles: their padding and border are always written. */
const ALWAYS_BOX = new Set(["blockquote", "ol", "td", "th", "ul"]);

const CJK = /[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef\u3000-\u303f]/;

const NBSP = "\u00a0";

const round = (value, digits = 2) => Math.round(value * 10 ** digits) / 10 ** digits;
const px = (value) => (Math.abs(value) < 0.005 ? "0" : `${round(value)}px`);
const float = (value) => Number.parseFloat(value) || 0;

function create(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

/** The same element under another tag name. */
function retag(el, tag) {
  const next = document.createElement(tag);
  for (const { name, value } of el.attributes) next.setAttribute(name, value);
  next.append(...el.childNodes);
  el.replaceWith(next);
  return next;
}

function fileName(src, fallback) {
  try {
    const name = decodeURIComponent(new URL(src, location.href).pathname.split("/").pop() ?? "");
    return name || fallback;
  } catch {
    return fallback;
  }
}

/* ------------------------------------------------------------------ */
/* 1. Rewrite                                                         */
/* ------------------------------------------------------------------ */

/** The page's own controls sit between <!--ui--> and <!--/ui--> comments. */
function removeChrome(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  const comments = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  for (const comment of comments) {
    if (comment.data.trim() === "ui") {
      let node = comment.nextSibling;
      while (node && !(node.nodeType === Node.COMMENT_NODE && node.data.trim() === "/ui")) {
        const next = node.nextSibling;
        node.remove();
        node = next;
      }
    }
    comment.remove();
  }
  // A minified page has lost the comments: the same controls by name.
  const chrome = ".heading-anchor, .code-header, .tabs-list, .repo-badge, .repo-meta, .footnote-backref, .visually-hidden";
  for (const el of root.querySelectorAll(chrome)) el.remove();
  for (const el of root.querySelectorAll("[id]")) el.removeAttribute("id");
}

/** Code blocks keep their file name or language as a plain first line. */
function labelCode(root) {
  const labels = new Map();
  for (const block of root.querySelectorAll(".code-block")) {
    const label = block.querySelector(".code-label")?.textContent.trim();
    if (label) labels.set(block, label);
  }
  return () => {
    for (const [block, label] of labels) block.prepend(create("div", "wx-code-label", label));
  };
}

/** A line that stands for a file the author uploads in the WeChat editor. */
function placeholder(ctx, kind, name, extra = {}) {
  const upload = { n: ctx.uploads.length + 1, kind, name, ...extra };
  ctx.uploads.push(upload);
  const box = create("div", "wx-placeholder");
  box.append(
    create("span", "wx-placeholder-label", `${ctx.strings[kind]} ${upload.n}`),
    " · ",
    create("span", "wx-placeholder-name", name),
  );
  return box;
}

function embed(ctx, href, text) {
  ctx.notes.embeds += 1;
  const line = create("p", "wx-embed");
  const link = create("a", "", text);
  link.href = href;
  line.append(link);
  return line;
}

function replaceMedia(root, ctx) {
  const selector =
    ".pele-figure, figure.live-photo, figure.video-player, figure.audio-player, figure.youtube, .media-frame, img, video, audio, iframe";
  for (const el of root.querySelectorAll(selector)) {
    if (!root.contains(el)) continue; // already replaced with its container

    if (el.matches(".pele-figure")) {
      const source = el.querySelector("pre.pele-source")?.textContent ?? "";
      const count = ctx.uploads.filter((upload) => upload.kind === "diagram").length + 1;
      el.replaceWith(placeholder(ctx, "diagram", `${ctx.slug}-diagram-${count}.png`, { source }));
    } else if (el.matches("figure.live-photo")) {
      const src = el.querySelector("img")?.getAttribute("src") ?? "";
      ctx.notes.live += 1;
      (el.querySelector(".live-photo-frame") ?? el).replaceWith(placeholder(ctx, "image", fileName(src, "image"), { src }));
    } else if (el.matches("figure.video-player")) {
      const src = el.querySelector("video")?.getAttribute("src") ?? "";
      ctx.notes.media += 1;
      (el.querySelector(".video-frame") ?? el).replaceWith(placeholder(ctx, "video", fileName(src, "video"), { src }));
    } else if (el.matches("figure.audio-player")) {
      const src = el.querySelector("audio")?.getAttribute("src") ?? "";
      const name = fileName(src, "audio");
      const box = placeholder(ctx, "audio", name, { src });
      const title = [".audio-title", ".audio-artist"]
        .map((part) => el.querySelector(part)?.textContent.trim())
        .filter(Boolean)
        .join(" — ");
      // An untitled track is shown under its file name: say it once.
      if (title && title !== name) box.append(create("span", "wx-placeholder-detail", title));
      ctx.notes.media += 1;
      el.replaceWith(box);
    } else if (el.matches("figure.youtube")) {
      const href = el.querySelector("a.youtube-poster")?.href;
      const title = el.dataset.title || "YouTube";
      const caption = el.querySelector(":scope > figcaption");
      if (caption?.textContent.trim() === title) caption.remove();
      if (href) (el.querySelector(".youtube-frame") ?? el).replaceWith(embed(ctx, href, `YouTube · ${title}`));
    } else if (el.matches(".media-frame")) {
      const src = el.querySelector("img")?.getAttribute("src") ?? "";
      el.replaceWith(placeholder(ctx, "image", fileName(src, "image"), { src }));
    } else if (el.localName === "img") {
      const src = el.getAttribute("src") ?? "";
      const name = fileName(src, "image");
      if (el.closest("p, li, td, th, h2, h3, h4, h5, h6")) {
        const upload = { n: ctx.uploads.length + 1, kind: "image", name, src };
        ctx.uploads.push(upload);
        el.replaceWith(create("span", "wx-inline-upload", `[${ctx.strings.image} ${upload.n} · ${name}]`));
      } else {
        el.replaceWith(placeholder(ctx, "image", name, { src }));
      }
    } else if (el.localName === "iframe") {
      let host = "";
      try {
        host = new URL(el.src).hostname;
      } catch {
        // No usable address: nothing to point at.
      }
      if (host) el.replaceWith(embed(ctx, el.src, el.title || host));
      else el.remove();
    } else {
      const src = el.getAttribute("src") ?? el.querySelector("source")?.getAttribute("src") ?? "";
      ctx.notes.media += 1;
      el.replaceWith(placeholder(ctx, el.localName, fileName(src, el.localName), { src }));
    }
  }
}

/** Tabs and details have no closed state in WeChat: show everything. */
function expand(root, ctx) {
  for (const panel of root.querySelectorAll(".tabs-panel")) panel.removeAttribute("hidden");
  for (const details of root.querySelectorAll("details")) {
    details.open = true;
    details.removeAttribute("name");
  }
  ctx.notes.expanded = root.querySelectorAll(".tabs, details").length;
}

/**
 * Line numbers padded to one width in each block: they are exported as plain
 * text, with nothing else to line them up.
 */
function padLineNumbers(root) {
  for (const pre of root.querySelectorAll("pre")) {
    const numbers = [...pre.querySelectorAll(".ln, .lnt")];
    const width = Math.max(0, ...numbers.map((number) => number.textContent.trim().length));
    for (const number of numbers) number.textContent = number.textContent.trim().padStart(width, " ");
  }
}

/**
 * Checkboxes drawn as boxes: <input> does not survive the editor. An empty
 * box holds no-break spaces about as wide as the tick.
 */
function drawTasks(root) {
  for (const input of root.querySelectorAll('li > input[type="checkbox"], li > p:first-child > input[type="checkbox"]')) {
    if (input.previousElementSibling) continue;
    const box = create("span", "wx-task", input.checked ? "\u2713" : NBSP.repeat(3));
    box.toggleAttribute("data-checked", input.checked);
    input.closest("li").classList.add("wx-task-item");
    const after = input.nextSibling;
    if (after?.nodeType === Node.TEXT_NODE) after.data = after.data.replace(/^\s+/, "");
    input.replaceWith(box);
  }
}

/** Ruby readings in parentheses after the text. */
function flattenRuby(root) {
  const wide = /^(zh|ja)/i.test(document.documentElement.lang);
  for (const ruby of root.querySelectorAll("ruby")) {
    let base = "";
    const readings = [];
    for (const node of ruby.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) base += node.data;
      else if (node.localName === "rt") readings.push(node.textContent.trim());
      else if (node.localName !== "rp") base += node.textContent;
    }
    const span = create("span", "wx-ruby", base.trim());
    const reading = readings.filter(Boolean).join(" ");
    if (reading) span.append(create("span", "wx-ruby-reading", wide ? `（${reading}）` : ` (${reading})`));
    ruby.replaceWith(span);
  }
}

/**
 * Links work only inside WeChat. Other links keep their text, gain a number
 * and are listed with their address at the end of the article.
 */
function rewriteLinks(root, ctx) {
  const references = new Map();
  const bare = (text) => text.replace(/^https?:\/\//, "").replace(/\/$/, "");

  for (const link of root.querySelectorAll("a")) {
    const card = link.matches(".repo-card");
    const plain = () => {
      if (card) retag(link, "div");
      else link.replaceWith(...link.childNodes);
    };
    if (link.matches(".footnote-ref")) {
      retag(link, "span");
      continue;
    }
    const raw = link.getAttribute("href") ?? "";
    let url = null;
    try {
      url = new URL(raw, location.href);
    } catch {
      // Not an address: plain text.
    }
    if (!raw || raw.startsWith("#") || !url || !/^https?:$/.test(url.protocol)) {
      plain();
      continue;
    }
    if (url.hostname === "mp.weixin.qq.com") {
      link.setAttribute("href", url.href);
      link.classList.add("wx-link");
      link.dataset.wxKeep = "";
      continue;
    }
    let href = url.href;
    if (url.origin === location.origin) {
      if (!ctx.baseURL) {
        ctx.notes.internalLinks += 1;
        plain();
        continue;
      }
      href = new URL(url.pathname + url.search + url.hash, ctx.baseURL).href;
    }

    const text = link.textContent.trim().replace(/\s+/g, " ");
    const title = link.title || text;
    const el = retag(link, card ? "div" : "span");
    if (!card) el.classList.add("wx-link");
    el.removeAttribute("href");
    if (!card && bare(text) === bare(href)) continue; // the text is the address

    let reference = references.get(href);
    if (!reference) {
      reference = { n: references.size + 1, title };
      references.set(href, reference);
    }
    const mark = create("sup", "wx-ref", `[${reference.n}]`);
    if (card) (el.querySelector(".repo-name") ?? el).append(mark);
    else el.after(mark);
  }

  ctx.notes.links = references.size;
  if (!references.size) return;
  const list = create("section", "wx-references");
  list.append(create("p", "wx-references-title", ctx.strings.references));
  for (const [href, { n, title }] of references) {
    const item = create("p", "wx-reference");
    const short = title.length > 60 ? `${title.slice(0, 59)}…` : title;
    item.append(
      create("span", "wx-reference-index", `[${n}]`),
      " ",
      create("span", "wx-reference-title", `${short}:`),
      " ",
      create("span", "wx-reference-url", href),
    );
    list.append(item);
  }
  root.append(list);
}

function prepare(root, ctx) {
  const addCodeLabels = labelCode(root);
  removeChrome(root);
  addCodeLabels();
  replaceMedia(root, ctx);
  expand(root, ctx);
  padLineNumbers(root);
  drawTasks(root);
  flattenRuby(root);
  rewriteLinks(root, ctx);
}

/* ------------------------------------------------------------------ */
/* 3. Inline the computed styles                                      */
/* ------------------------------------------------------------------ */

function textAlign(style) {
  const rtl = style.direction === "rtl";
  const value = style.textAlign;
  if (value === "start") return rtl ? "right" : "left";
  if (value === "end") return rtl ? "left" : "right";
  return value.replace("-webkit-", "");
}

function inheritedValues(style) {
  const size = float(style.fontSize);
  return {
    color: toPlainColor(style.color),
    "font-size": px(size),
    "font-style": style.fontStyle,
    "font-weight": style.fontWeight,
    "letter-spacing": style.letterSpacing === "normal" ? "normal" : px(float(style.letterSpacing)),
    "line-height": style.lineHeight === "normal" || !size ? "normal" : String(round(float(style.lineHeight) / size)),
    "list-style-type": style.listStyleType,
    "text-align": textAlign(style),
    "white-space": style.whiteSpace || "normal",
    "word-break": style.wordBreak,
  };
}

/** "a b c d" in the shortest CSS form. */
function sides([top, right, bottom, left]) {
  if (right === left) {
    if (top === bottom) return top === right ? top : `${top} ${right}`;
    return `${top} ${right} ${bottom}`;
  }
  return `${top} ${right} ${bottom} ${left}`;
}

/**
 * The narrowest width at which a table still reads well.
 *
 * WeChat pins a table to the width of the text column. On a phone, a table
 * with many columns then squeezes the ones that can wrap down to a character
 * or two per line, and its rows grow very tall. Given a minimum width, the
 * table keeps readable columns and scrolls sideways in its wrapper instead.
 *
 * The width is found by trying: the smallest one, between the table's
 * narrowest and its natural width (TABLE_COMFORT at most), at which no cell
 * is both narrow and many lines long.
 */
function comfortableWidth(table) {
  const saved = table.style.width;
  const measure = (width) => {
    table.style.width = width;
    return table.offsetWidth;
  };
  const cells = [...table.querySelectorAll("td")];
  const cramped = () =>
    cells.some((cell) => {
      const style = getComputedStyle(cell);
      const size = float(style.fontSize);
      const line = float(style.lineHeight) || size * 1.5;
      const lines = (cell.clientHeight - float(style.paddingTop) - float(style.paddingBottom)) / line;
      const width = cell.clientWidth - float(style.paddingLeft) - float(style.paddingRight);
      return lines > 3.5 && width < size * 10;
    });

  const natural = measure("max-content");
  let low = measure("min-content");
  let high = Math.min(natural, Math.max(low, TABLE_COMFORT));
  for (let i = 0; i < 8 && high - low > 4; i++) {
    const middle = (low + high) / 2;
    measure(`${middle}px`);
    if (cramped()) low = middle;
    else high = middle;
  }
  table.style.width = saved;
  return Math.ceil(high);
}

/** Whether an element scrolls its content sideways. */
function scrolls(el) {
  return Boolean(el) && ["auto", "scroll"].includes(getComputedStyle(el).overflowX);
}

/** Whether the element is centred with auto margins (the computed px hide it). */
function autoMargins(el, style) {
  if (typeof el.computedStyleMap === "function") {
    const map = el.computedStyleMap();
    return map.get("margin-left")?.value === "auto" && map.get("margin-right")?.value === "auto";
  }
  return el.localName === "hr" && float(style.marginLeft) > 0;
}

function boxDeclarations(el, style, tag, inline) {
  const out = [];
  const edge = (name) => ["Top", "Right", "Bottom", "Left"].map((side) => float(style[name.replace("*", side)]));

  const margin = edge("margin*");
  if (inline) margin[0] = margin[2] = 0;
  if (margin.some(Boolean)) {
    const values = margin.map(px);
    if (!inline && autoMargins(el, style)) values[1] = values[3] = "auto";
    out.push(`margin:${sides(values)}`);
  }

  const padding = edge("padding*");
  if (padding.some(Boolean) || ALWAYS_BOX.has(tag)) out.push(`padding:${sides(padding.map(px))}`);

  const borders = ["Top", "Right", "Bottom", "Left"].map((side) => {
    const width = float(style[`border${side}Width`]);
    const line = style[`border${side}Style`];
    const visible = width > 0 && line !== "none" && line !== "hidden";
    return { width: visible ? width : 0, line, color: visible ? formatColor(veil(parseColor(style[`border${side}Color`]))) : "" };
  });
  const drawn = borders.filter((border) => border.width);
  if (drawn.length) {
    const same = drawn.every((border) => border.line === drawn[0].line && border.color === drawn[0].color);
    if (drawn.length === 4 && same && drawn.every((border) => border.width === drawn[0].width)) {
      out.push(`border:${px(drawn[0].width)} ${drawn[0].line} ${drawn[0].color}`);
    } else if (same) {
      out.push(
        `border-style:${drawn[0].line}`,
        `border-width:${sides(borders.map((border) => px(border.width)))}`,
        `border-color:${drawn[0].color}`,
      );
    } else {
      out.push("border-style:none");
      for (const [i, side] of ["top", "right", "bottom", "left"].entries()) {
        const border = borders[i];
        if (border.width) out.push(`border-${side}:${px(border.width)} ${border.line} ${border.color}`);
      }
    }
  } else if (ALWAYS_BOX.has(tag)) {
    out.push("border:0");
  }

  const radius = ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map((corner) => float(style[`border${corner}Radius`]));
  if (radius.some(Boolean)) out.push(`border-radius:${sides(radius.map(px))}`);

  const background = parseColor(style.backgroundColor);
  if (background.a > 0) out.push(`background-color:${formatColor(veil(background))}`);

  if (["auto", "scroll"].includes(style.overflowX)) out.push("overflow-x:auto");
  else if (style.overflowX === "hidden" && style.overflowY === "hidden" && radius.some(Boolean)) out.push("overflow:hidden");

  if (inline && style.verticalAlign !== "baseline") out.push(`vertical-align:${style.verticalAlign}`);
  if (style.textDecorationLine && style.textDecorationLine !== "none") {
    out.push(`text-decoration:${style.textDecorationLine}`);
  }

  if (tag === "table") {
    out.push("width:100%", `border-collapse:${style.borderCollapse}`);
    // Wider than the narrowest phone column: say so, and the table scrolls
    // there instead of crushing its columns. Wider screens still stretch it.
    // Only inside a wrapper that scrolls: anywhere else it would spill.
    if (scrolls(el.parentElement)) {
      const comfortable = comfortableWidth(el);
      if (comfortable > NARROWEST_COLUMN) out.push(`min-width:${px(comfortable)}`);
    }
  }
  if (tag === "td" || tag === "th") out.push(`vertical-align:${style.verticalAlign}`);
  if (tag === "hr") out.push(`width:${px(float(style.width))}`, "height:0");
  return out;
}

/** Text of a ::before or ::after that is plain words ("—— "), if any. */
function pseudoText(el, which) {
  const style = getComputedStyle(el, which);
  const match = style.content.match(/^"((?:[^"\\]|\\.)*)"$/);
  if (!match?.[1] || style.display === "none" || style.position === "absolute" || style.position === "fixed") return null;
  return { text: match[1].replace(/\\(.)/g, "$1"), color: toPlainColor(style.color) };
}

/**
 * Text as the browser would lay it out. Preformatted text keeps its line
 * breaks as <br> and its spaces as no-break spaces: the editor collapses
 * white space whatever the style says.
 */
function appendText(out, data, mode, tabSize) {
  if (mode === "normal" || mode === "nowrap") {
    // Only the white space HTML collapses: a no-break space is content.
    const text = data.replace(/[ \t\n\r\f]+/g, (run, offset) => {
      if (!run.includes("\n")) return " ";
      // A line break between two CJK characters is not a space.
      return CJK.test(data[offset - 1] ?? "") && CJK.test(data[offset + run.length] ?? "") ? "" : " ";
    });
    if (text) out.append(text);
    return;
  }
  const lines = data.split("\n");
  for (const [i, line] of lines.entries()) {
    if (i) out.append(document.createElement("br"));
    let text = line.replaceAll("\t", " ".repeat(tabSize));
    if (mode === "pre") text = text.replaceAll(" ", NBSP);
    else if (mode === "pre-line") text = text.replace(/ +/g, " ");
    if (text) out.append(text);
  }
}

/**
 * Give each run of inline content in a block a <section> of its own, where
 * the editor would otherwise tear the run apart.
 *
 * In a list item or a table cell the editor accepts only blocks. It wraps
 * loose text in a <section>, but leaves an inline element beside that text
 * where it was, outside the new block:
 *
 *   <li><span>x</span>Pack</li>  becomes  <li><span>x</span><section>Pack</section></li>
 *
 * and the two land on separate lines. With the whole run wrapped beforehand
 * the editor has nothing to add. The same is done wherever inline content
 * stands next to a block, in any other container.
 *
 * @param {Element} el     a block of the exported tree, children already built
 * @param {boolean} always wrap even when the block holds inline content only
 */
function wrapLines(el, always) {
  const nodes = [...el.childNodes];
  const inline = (node) => node.nodeType === Node.TEXT_NODE || INLINE_TAGS.has(node.localName);
  const blank = (node) => node.nodeType === Node.TEXT_NODE && /^[ \t\n\r\f]*$/.test(node.data);
  if (nodes.every((node) => !inline(node) || blank(node))) return;
  if (!always && nodes.every(inline)) return;
  let line = null;
  for (const node of nodes) {
    if (!inline(node)) {
      line = null;
    } else if (line) {
      line.append(node);
    } else if (blank(node)) {
      node.remove(); // white space between two blocks
    } else {
      line = document.createElement("section");
      node.before(line);
      line.append(node);
    }
  }
}

function build(el, parent, out) {
  const tag = el.localName;
  if (SKIP.has(tag)) return;
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility !== "visible") return;
  if (style.position === "absolute" || style.position === "fixed") return;

  const inline = style.display.startsWith("inline");
  const blockChildren = [...el.children].some((child) => !getComputedStyle(child).display.startsWith("inline"));
  const values = inheritedValues(style);
  const mode = values["white-space"];
  // Preformatted lines are written out with <br> and no-break spaces
  // (appendText), so all that is left to ask for is "do not wrap".
  if (mode === "pre") values["white-space"] = "nowrap";
  let target = out;
  let next = parent;

  if (style.display !== "contents") {
    // A block-level <span> among blocks becomes a <section>: the editor keeps
    // inline containers for inline content. Inside a line of text (a
    // highlighted code line) it stays a <span> shown as a block.
    const blockSpan = tag === "span" && !inline && parent.block;
    const name = KEEP.has(tag) && !blockSpan ? tag : inline ? "span" : "section";
    target = document.createElement(name);
    const declarations = [];

    for (const property of INHERITED) {
      if (property === "list-style-type" && !["ul", "ol", "li"].includes(name)) continue;
      if (values[property] !== parent.values[property] || ALWAYS[name]?.includes(property)) {
        declarations.push(`${property}:${values[property]}`);
      }
    }

    if (INLINE_TAGS.has(name)) {
      if (!inline) declarations.push("display:block");
      else if (style.display !== "inline") declarations.push("display:inline-block");
    } else if (!TABLE_TAGS.has(name) && name !== "li") {
      if (style.display === "inline") declarations.push("display:inline");
      else if (inline) declarations.push("display:inline-block");
    }

    // The root carries the text settings only: its own margins belong to the page.
    if (!parent.root) declarations.push(...boxDeclarations(el, style, name, inline));
    if (declarations.length) target.setAttribute("style", declarations.join(";"));

    if (name === "a") target.setAttribute("href", el.getAttribute("href"));
    if (name === "td" || name === "th") {
      for (const span of ["colspan", "rowspan"]) if (el.hasAttribute(span)) target.setAttribute(span, el.getAttribute(span));
    }
    if (name === "ol" && el.hasAttribute("start")) target.setAttribute("start", el.getAttribute("start"));
    // WeChat's own check reads a set width as a layout mistake unless it is
    // marked as meant: here, a table that scrolls sideways in its wrapper.
    // The check looks at the wrapper for the cells and at the table for itself.
    if (name === "table" && declarations.some((declaration) => declaration.startsWith("min-width"))) {
      out.setAttribute("data-ignore-width", "");
      target.setAttribute("data-ignore-width", "");
    }

    out.append(target);
    next = { values, root: false, block: !INLINE_TAGS.has(name) };
  }

  if (tag === "br" || tag === "hr") return;

  const preformatted = mode.startsWith("pre") || mode === "break-spaces";
  const pseudo = (which) => {
    if (preformatted) return;
    const content = pseudoText(el, which);
    if (!content) return;
    const span = create("span", "", content.text);
    if (content.color !== values.color) span.setAttribute("style", `color:${content.color}`);
    target.append(span);
  };

  pseudo("::before");
  const tabSize = Number.parseInt(style.tabSize, 10) || 2;
  for (const node of el.childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      build(node, next, target);
    } else if (node.nodeType === Node.TEXT_NODE) {
      // White space between blocks is formatting, not content.
      if (blockChildren && !preformatted && !node.data.trim()) continue;
      appendText(target, node.data, mode, tabSize);
    }
  }
  pseudo("::after");

  const name = target.localName;
  if (target !== out && !INLINE_TAGS.has(name) && !TEXT_BLOCKS.has(name)) wrapLines(target, LINE_HOLDERS.has(name));
}

/** Remove what ended up empty (wrappers of removed controls, blank paragraphs). */
function prune(el) {
  for (const child of [...el.children]) prune(child);
  if (!INLINE_TAGS.has(el.localName)) {
    // Spaces at the edges of a block are formatting (no-break spaces stay).
    const first = el.firstChild;
    if (first?.nodeType === Node.TEXT_NODE) first.data = first.data.replace(/^[ \t\n]+/, "");
    const last = el.lastChild;
    if (last?.nodeType === Node.TEXT_NODE) last.data = last.data.replace(/[ \t\n]+$/, "");
    for (const node of [first, last]) if (node?.nodeType === Node.TEXT_NODE && !node.data) node.remove();
  }
  if (["br", "hr", "td", "th"].includes(el.localName)) return;
  if (!el.firstChild && el.parentElement) el.remove();
}

const BLOCKS = new Set(["blockquote", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "li", "p", "pre", "section", "table", "tr"]);

/** The article as plain text, one block per line. */
function plainText(root) {
  let text = "";
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.data.replaceAll(NBSP, " ");
      return;
    }
    if (node.localName === "br") text += "\n";
    // A cell's line (wrapLines()) is not a line of its own in a row of text.
    const cellLine = node.localName === "section" && ["td", "th"].includes(node.parentElement?.localName);
    const block = BLOCKS.has(node.localName) && !cellLine;
    if (block && text && !text.endsWith("\n")) text += "\n";
    for (const child of node.childNodes) walk(child);
    if (block && !text.endsWith("\n")) text += "\n";
    if (node.localName === "td" || node.localName === "th") text += "\t";
  };
  walk(root);
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Convert the article body.
 *
 * @param {Element} prose  the page's .prose element (left untouched)
 * @param {object} options strings (words written into the article), baseURL
 *   (the site's public address, for links to its own pages), slug (file name
 *   stem for diagrams)
 * @returns {{ html: string, text: string, uploads: object[], notes: object }}
 *   uploads lists the files the author adds by hand, in article order.
 */
export function convert(prose, { strings, baseURL = "", slug = "post" }) {
  const ctx = {
    strings,
    baseURL,
    slug,
    uploads: [],
    notes: { links: 0, internalLinks: 0, media: 0, expanded: 0, live: 0, embeds: 0 },
  };

  const copy = prose.cloneNode(true);
  copy.dataset.wechat = "";
  prepare(copy, ctx);

  const stage = create("div", "wechat-stage");
  stage.inert = true;
  stage.append(copy);
  document.body.append(stage);
  const holder = document.createElement("div");
  try {
    // Every inherited value WeChat does not already give is written on the root.
    const outside = Object.fromEntries(INHERITED.map((property) => [property, WECHAT_ROOT[property] ?? null]));
    build(copy, { values: outside, root: true, block: true }, holder);
  } finally {
    stage.remove();
  }

  const root = holder.firstElementChild;
  if (!root) return { html: "", text: "", uploads: ctx.uploads, notes: ctx.notes };
  prune(root);
  return { html: root.outerHTML, text: plainText(root), uploads: ctx.uploads, notes: ctx.notes };
}
