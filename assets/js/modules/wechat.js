/**
 * WeChat Official Account export (local preview only).
 *
 * Under `hugo server`, with params.wechat.enable, opening an article with
 * #wechat in its address shows this panel: the article as the WeChat editor
 * will keep it (wechat-convert.js), previewed on a desktop, tablet or phone
 * screen and in WeChat's light or dark mode, a button that copies it, and
 * the list of files to upload by hand. Nothing here is built into a
 * published site.
 *
 * The dark preview runs mp-darkmode, the algorithm WeChat itself applies to
 * articles (it is not something an author can style), so what shows is what
 * readers in dark mode get.
 */
import { GROUND } from "./wechat-color.js";
import { convert } from "./wechat-convert.js";
import { renderDiagram } from "./wechat-diagram.js";
import { vendorScripts } from "./vendor.js";

const HASH = "#wechat";
const FEEDBACK_MS = 2400;

/**
 * Width of WeChat's text column, in px, on each preview screen. Desktop and
 * tablet are the widths WeChat's own layout check measures (677 and 585); the
 * phone is its third, a 375px screen, less the gutter on each side.
 */
const GUTTER = 16;
const COLUMNS = { desktop: 677, tablet: 585, phone: 375 - 2 * GUTTER };

/**
 * The parts of WeChat's article stylesheet that reach pasted content, so the
 * preview shows a missing inline style the way WeChat would.
 */
const WECHAT_CSS = `
*{margin:0;padding:0}
html{background:${GROUND.light}}
html[data-scheme="dark"]{background:${GROUND.dark};color-scheme:dark}
html{overflow-y:scroll;scrollbar-width:thin}
body{padding:20px ${GUTTER}px 40px;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei UI","Microsoft YaHei",Arial,sans-serif;-webkit-text-size-adjust:100%}
.rich_media_content{overflow:hidden;color:rgba(0,0,0,.9);font-size:17px;line-height:1.6;letter-spacing:.034em;word-wrap:break-word;text-align:justify}
html[data-scheme="dark"] .rich_media_content{color:#a3a3a3}
.rich_media_content *{max-width:100%!important;box-sizing:border-box!important;word-wrap:break-word!important}
.rich_media_content p{clear:both;min-height:1em}
.rich_media_content h1,.rich_media_content h2,.rich_media_content h3,.rich_media_content h4,.rich_media_content h5,.rich_media_content h6{font-weight:400;font-size:16px}
.rich_media_content ul,.rich_media_content ol{padding-left:1.2em}
.rich_media_content blockquote{padding-left:10px;border-left:3px solid #dbdbdb}
.rich_media_content table{margin-bottom:10px;border-collapse:collapse;display:table;width:100%!important}
.rich_media_content td,.rich_media_content th{word-break:break-all;padding:5px 10px;border:1px solid #ddd}
.rich_media_content hr{border-style:solid;border-width:1px 0 0;border-color:rgba(0,0,0,.1)}
`;

function create(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function previewDocument(html, scheme) {
  const lang = document.documentElement.lang || "en";
  return (
    `<!doctype html><html lang="${lang}" data-scheme="${scheme}"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1"><style>${WECHAT_CSS}</style></head>` +
    `<body><div class="rich_media_content">${html}</div></body></html>`
  );
}

/** Run WeChat's dark mode conversion inside the preview document. */
function darken(frame) {
  const doc = frame.contentDocument;
  const [vendor] = vendorScripts("wechat");
  if (!doc || !vendor) return;
  const script = doc.createElement("script");
  script.src = vendor.src;
  script.onload = () => {
    frame.contentWindow.Darkmode?.run(doc.body.querySelectorAll("*"), {
      mode: "dark",
      needJudgeFirstPage: false,
      defaultDarkBgColor: GROUND.dark,
    });
  };
  doc.head.append(script);
}

async function copyRich(html, text) {
  if (navigator.clipboard?.write && typeof ClipboardItem === "function") {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        }),
      ]);
      return true;
    } catch {
      // Fall through to the copy event.
    }
  }
  let done = false;
  const onCopy = (event) => {
    event.clipboardData.setData("text/html", html);
    event.clipboardData.setData("text/plain", text);
    event.preventDefault();
    done = true;
  };
  document.addEventListener("copy", onCopy, { once: true });
  document.execCommand("copy");
  document.removeEventListener("copy", onCopy);
  return done;
}

export function initWeChat() {
  const dialog = document.querySelector("dialog[data-wechat]");
  const prose = document.querySelector(".article > .prose");
  if (!dialog || !prose) return;

  let strings = {};
  try {
    strings = JSON.parse(document.getElementById("wechat-strings")?.textContent || "{}");
  } catch {
    return;
  }

  const frame = dialog.querySelector("[data-wechat-frame]");
  const preview = dialog.querySelector(".wechat-preview");
  const device = dialog.querySelector("[data-wechat-device]");
  const widthLabel = dialog.querySelector("[data-wechat-width]");
  const viewButtons = [...dialog.querySelectorAll("[data-wechat-view]")];
  const copyButton = dialog.querySelector("[data-wechat-copy]");
  const copyLabel = copyButton.querySelector("[data-wechat-copy-label]");
  const status = dialog.querySelector("[data-wechat-status]");
  const uploadList = dialog.querySelector("[data-wechat-uploads]");
  const uploadEmpty = dialog.querySelector("[data-wechat-uploads-empty]");
  const uploadHint = dialog.querySelector("[data-wechat-uploads-hint]");
  const noteSection = dialog.querySelector("[data-wechat-notes-section]");
  const noteList = dialog.querySelector("[data-wechat-notes]");
  const schemeButtons = [...dialog.querySelectorAll("[data-wechat-scheme]")];
  const icon = (name) => dialog.querySelector(`template[data-wechat-icon="${name}"]`)?.content.cloneNode(true);

  let result = null;
  let view = "desktop";
  let scheme = "light";
  let run = 0; // conversions started; a late diagram from an earlier one is dropped
  let feedback = 0;
  const objectURLs = [];

  /**
   * Make the sheet as wide as the chosen screen: column, gutters and the
   * scrollbar. In a window too narrow for it, the sheet is shown smaller
   * (the label says how much) rather than cut off: the layout inside is
   * still that of the full width.
   */
  function sizeDevice() {
    const column = COLUMNS[view];
    device.style.zoom = "";
    const page = frame.contentDocument?.documentElement;
    const scrollbar = page ? Math.max(0, frame.clientWidth - page.clientWidth) : 0;
    const width = column + 2 * GUTTER + scrollbar;
    device.style.inlineSize = `${width}px`;

    const style = getComputedStyle(preview);
    const room = preview.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight);
    const scale = Math.min(1, room / (width + 2));
    device.style.setProperty("--wechat-zoom", String(scale));
    if (scale < 1) {
      device.style.zoom = String(scale);
      // A scrollbar does not shrink with the sheet: give back what it takes.
      const short = page ? column + 2 * GUTTER - page.clientWidth : 0;
      if (short > 0) device.style.inlineSize = `${width + short}px`;
    }

    const label = strings.column.replace("{width}", String(column));
    widthLabel.textContent = scale < 1 ? `${label} · ${Math.round(scale * 100)}%` : label;
    for (const button of viewButtons) button.setAttribute("aria-pressed", String(button.dataset.wechatView === view));
  }

  function showPreview() {
    dialog.dataset.scheme = scheme;
    for (const button of schemeButtons) button.setAttribute("aria-pressed", String(button.dataset.wechatScheme === scheme));
    frame.onload = () => {
      sizeDevice();
      if (scheme === "dark") darken(frame);
    };
    frame.srcdoc = previewDocument(result?.html ?? "", scheme);
    sizeDevice();
  }

  function listNotes(notes) {
    const rows = [
      ["links", strings.noteLinks],
      ["internalLinks", strings.noteInternalLinks],
      ["embeds", strings.noteEmbeds],
      ["media", strings.noteMedia],
      ["live", strings.noteLive],
      ["expanded", strings.noteExpanded],
    ].filter(([key]) => notes[key] > 0);
    noteList.replaceChildren(
      ...rows.map(([key, text]) => {
        const item = create("li", "wechat-note");
        item.append(create("span", "wechat-note-text", text), create("span", "wechat-note-count numeric", String(notes[key])));
        return item;
      }),
    );
    noteSection.hidden = !rows.length;
  }

  function uploadItem(upload) {
    const item = create("li", "wechat-upload");
    item.dataset.kind = upload.kind;
    const thumb = create("span", "wechat-upload-thumb");
    if (upload.kind === "image" && upload.src) {
      const image = create("img");
      image.src = upload.src;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      thumb.append(image);
    } else {
      thumb.append(icon(upload.kind) ?? "");
    }
    const text = create("span", "wechat-upload-text");
    text.append(
      create("span", "wechat-upload-kind", `${strings[upload.kind]} ${upload.n}`),
      create("span", "wechat-upload-name", upload.name),
    );
    item.append(thumb, text);
    if (upload.src) item.append(downloadLink(upload.src, upload.name));
    if (upload.kind === "diagram") text.append(create("span", "wechat-upload-state", strings.diagramPending));
    return item;
  }

  function downloadLink(href, name) {
    const link = create("a", "wechat-upload-get", strings.download);
    link.href = href;
    link.download = name;
    return link;
  }

  async function drawDiagrams(uploads, items, current) {
    for (const [i, upload] of uploads.entries()) {
      if (upload.kind !== "diagram") continue;
      const item = items[i];
      const state = item.querySelector(".wechat-upload-state");
      try {
        const { blob } = await renderDiagram(upload.source);
        if (current !== run) return;
        const url = URL.createObjectURL(blob);
        objectURLs.push(url);
        const image = create("img");
        image.src = url;
        image.alt = "";
        item.querySelector(".wechat-upload-thumb").replaceChildren(image);
        state.textContent = strings.diagramReady;
        item.append(downloadLink(url, upload.name));
      } catch (error) {
        if (current !== run) return;
        state.textContent = strings.diagramFailed;
        item.dataset.failed = "";
        console.warn("[icy] WeChat export: diagram could not be drawn:", error);
      }
    }
  }

  function release() {
    for (const url of objectURLs.splice(0)) URL.revokeObjectURL(url);
  }

  function open() {
    if (dialog.open) return;
    dialog.showModal();
    // showModal() focuses the first button, which then shows a focus ring
    // for no reason when the page was opened from the keyboard.
    dialog.focus();
    run += 1;
    release();
    result = convert(prose, { strings, baseURL: dialog.dataset.baseUrl || "", slug: dialog.dataset.slug || "post" });
    showPreview();

    const items = result.uploads.map(uploadItem);
    uploadList.replaceChildren(...items);
    uploadList.hidden = uploadHint.hidden = !items.length;
    uploadEmpty.hidden = Boolean(items.length);
    listNotes(result.notes);
    drawDiagrams(result.uploads, items, run);
  }

  for (const button of viewButtons) {
    button.addEventListener("click", () => {
      view = button.dataset.wechatView;
      sizeDevice();
    });
  }

  for (const button of schemeButtons) {
    button.addEventListener("click", () => {
      if (scheme === button.dataset.wechatScheme) return;
      scheme = button.dataset.wechatScheme;
      showPreview();
    });
  }

  copyButton.addEventListener("click", async () => {
    if (!result) return;
    const copied = await copyRich(result.html, result.text);
    copyButton.dataset.state = copied ? "copied" : "failed";
    copyLabel.textContent = copied ? strings.copied : strings.copyFailed;
    status.textContent = copied ? strings.copiedHint : strings.copyFailed;
    window.clearTimeout(feedback);
    feedback = window.setTimeout(() => {
      delete copyButton.dataset.state;
      copyLabel.textContent = strings.copy;
      status.textContent = "";
    }, FEEDBACK_MS);
  });

  dialog.addEventListener("close", () => {
    run += 1;
    release();
    frame.onload = null;
    frame.srcdoc = "";
    if (location.hash === HASH) history.replaceState(null, "", location.pathname + location.search);
  });

  new ResizeObserver(() => {
    if (dialog.open) sizeDevice();
  }).observe(preview);

  const sync = () => {
    if (location.hash === HASH) open();
  };
  window.addEventListener("hashchange", sync);
  sync();
}
