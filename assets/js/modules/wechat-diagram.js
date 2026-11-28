/**
 * Pele diagrams as PNG files for WeChat.
 *
 * WeChat shows a diagram as an uploaded image. Its dark mode recolors text
 * and backgrounds but leaves images alone, so one file has to read on white
 * and on WeChat's dark ground (#191919) alike:
 *
 *   - Lines and letters keep the theme's hue but sit at the one luminance
 *     with equal contrast against both grounds (wechat-color.js).
 *   - The ground is transparent. Pele also paints its ground color over
 *     lines, behind edge labels; those patches are cut out of the image, so
 *     a label still interrupts the line it sits on.
 *   - Filled shapes (nodes, notes) hide what is under them, as on the page,
 *     and become a faint veil of the ink tone: a light tint on white, a
 *     lighter one on dark.
 *
 * How much of each pixel is ground or fill is measured, not guessed: the
 * diagram is drawn once with those colors black, then once per color with it
 * white. What a pixel gains is that color's share of it (compose()).
 */
import { balance, formatColor, parseColor } from "./wechat-color.js";
import { loadVendor } from "./vendor.js";

/** Width of WeChat's text column on a phone, in CSS px. */
const COLUMN = 343;
/** Pixels per CSS px: sharp on phone screens. */
const SCALE = 3;
const MAX_SIDE = 8192;

/** Pele's color variables for drawn marks. */
const INK = ["fg", "muted", "line", "border", "accent", "critical", "error"].concat(
  Array.from({ length: 8 }, (_, i) => `series-${i + 1}`),
);
/** Its ground and fills, and how opaque each is in the image. */
const LAYERS = { bg: 0, surface: 0.1, "surface-alt": 0.05 };

/** Presentation that must travel with the SVG once it leaves the page's CSS. */
const SVG_STYLE = [
  "display", "dominant-baseline", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-style",
  "font-weight", "letter-spacing", "opacity", "paint-order", "stroke", "stroke-dasharray", "stroke-dashoffset",
  "stroke-linecap", "stroke-linejoin", "stroke-opacity", "stroke-width", "text-anchor", "visibility",
];

/** A copy of the drawn SVG that carries its own styles and size. */
function standalone(svg, width, height) {
  const copy = svg.cloneNode(true);
  const sources = [svg, ...svg.querySelectorAll("*")];
  const targets = [copy, ...copy.querySelectorAll("*")];
  for (const [i, source] of sources.entries()) {
    const style = getComputedStyle(source);
    for (const property of SVG_STYLE) targets[i].style.setProperty(property, style.getPropertyValue(property));
  }
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  copy.setAttribute("width", String(width));
  copy.setAttribute("height", String(height));
  copy.style.removeProperty("max-width");
  copy.style.setProperty("display", "block");
  return new XMLSerializer().serializeToString(copy);
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("the diagram could not be drawn as an image"));
    image.src = url;
  });
}

/** The SVG as it looks now, painted on a transparent canvas. */
async function paint(svg, size, context) {
  const url = URL.createObjectURL(new Blob([standalone(svg, size.width, size.height)], { type: "image/svg+xml" }));
  try {
    const image = await loadImage(url);
    const { canvas } = context;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, size.x, 0, size.width * size.scale, size.height * size.scale);
    return context.getImageData(0, 0, canvas.width, canvas.height);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * The final pixels from one drawing with every layer black (`base`: the ink
 * alone shows) and one per layer with that layer white (`lit`).
 *
 * Painting is linear, so in premultiplied terms a pixel is
 * ink + Σ share(layer) × color(layer), and a layer's share is what the pixel
 * gains when that layer turns from black to white. The ink keeps its own
 * coverage; each layer comes back at its opacity in the veil color.
 */
function compose(base, lit, veil) {
  const out = new ImageData(base.width, base.height);
  const layers = Object.entries(LAYERS).map(([name, opacity]) => ({ data: lit[name].data, opacity }));
  const tint = [veil.r * 255, veil.g * 255, veil.b * 255];
  for (let i = 0; i < base.data.length; i += 4) {
    const total = base.data[i + 3] / 255;
    if (!total) continue;
    let covered = 0;
    let veiled = 0;
    for (const layer of layers) {
      const share = Math.min(1, Math.max(0, ((layer.data[i] - base.data[i]) * total) / 255));
      covered += share;
      veiled += share * layer.opacity;
    }
    const alpha = Math.max(0, total - covered) + veiled;
    if (alpha <= 0) continue;
    for (let c = 0; c < 3; c++) out.data[i + c] = Math.round((base.data[i + c] * total + tint[c] * veiled) / alpha);
    out.data[i + 3] = Math.round(alpha * 255);
  }
  return out;
}

/**
 * Draw one diagram.
 *
 * @param {string} source Pele source text
 * @param {number} [layoutWidth] width in CSS px the diagram has on the page.
 *   Pele chooses its layout from it (a timeline is vertical in a narrow
 *   column, horizontal in a wide one), so the image keeps the page's layout.
 *   Without it the diagram is laid out for WeChat's phone column.
 * @returns {Promise<{ blob: Blob, width: number, height: number }>} a PNG and
 *   its size in pixels
 */
export async function renderDiagram(source, layoutWidth = COLUMN) {
  await loadVendor("pele");
  if (!globalThis.pele?.mount) throw new Error("Pele is not available");

  // The same off-screen, light-scheme stage the article is measured in.
  const stage = document.createElement("div");
  stage.className = "wechat-stage";
  stage.inert = true;
  const figure = document.createElement("figure");
  figure.className = "pele-figure";
  figure.style.inlineSize = `${Math.max(layoutWidth, COLUMN)}px`;
  const container = document.createElement("div");
  container.className = "pele-diagram";
  figure.append(container);
  stage.append(figure);
  document.body.append(stage);

  try {
    // The theme's diagram colors (light scheme), retuned for both grounds.
    const probe = document.createElement("span");
    figure.append(probe);
    const themed = (name) => {
      probe.style.color = `var(--pele-${name})`;
      return balance(parseColor(getComputedStyle(probe).color));
    };
    const palette = Object.fromEntries(INK.map((name) => [name, formatColor(themed(name))]));
    const veil = themed("fg");
    probe.remove();
    for (const [name, value] of Object.entries(palette)) figure.style.setProperty(`--pele-${name}`, value);
    const light = (lit) => {
      for (const name of Object.keys(LAYERS)) figure.style.setProperty(`--pele-${name}`, name === lit ? "#fff" : "#000");
    };

    light(null);
    globalThis.pele.mount(container, source, {
      fontSize: Number.parseFloat(getComputedStyle(container).fontSize) || 14,
      config: { flowchart: { nodeSpacing: 28, rankSpacing: 40 } },
      links: false,
      images: false,
    });
    const svg = container.querySelector("svg");
    if (!svg) throw new Error("Pele drew nothing");

    const box = svg.viewBox.baseVal;
    const rect = svg.getBoundingClientRect();
    const width = Math.ceil(box?.width || rect.width);
    const height = Math.ceil(box?.height || rect.height);
    if (!width || !height) throw new Error("the diagram has no size");

    // A narrow diagram is centred in a column-wide image, so WeChat shows it
    // at its own size instead of stretching it to the full width.
    const frame = Math.max(width, COLUMN);
    const scale = Math.min(SCALE, MAX_SIDE / frame, MAX_SIDE / height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(frame * scale);
    canvas.height = Math.round(height * scale);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const size = { width, height, scale, x: ((frame - width) / 2) * scale };

    const base = await paint(svg, size, context);
    const lit = {};
    for (const name of Object.keys(LAYERS)) {
      light(name);
      lit[name] = await paint(svg, size, context);
    }
    context.putImageData(compose(base, lit, veil), 0, 0);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("the diagram could not be saved as a PNG");
    return { blob, width: canvas.width, height: canvas.height };
  } finally {
    stage.remove();
  }
}
