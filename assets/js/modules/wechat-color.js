/**
 * Colors for the WeChat export.
 *
 * The theme's palette lives in oklch(), light-dark() and color-mix(); the
 * WeChat editor keeps only plain inline colors. parseColor() reads a computed
 * color in any form the theme produces, formatColor() writes it as a hex or
 * rgba() value.
 *
 * balance() gives the tones of a diagram exported as a transparent PNG.
 * WeChat's dark mode recolors text and backgrounds but never images, so one
 * image must read on white and on the dark ground (#191919) alike: the tone
 * whose contrast is the same on both.
 */

/** WeChat's article grounds in light and dark mode. */
export const GROUND = { light: "#ffffff", dark: "#191919" };

const clamp = (value) => Math.min(1, Math.max(0, value));

/** "50%" -> 0.5 * scale, "0.5" -> 0.5, "none" -> 0. */
function number(token, scale = 1) {
  if (!token || token === "none") return 0;
  const value = Number.parseFloat(token);
  if (Number.isNaN(value)) return 0;
  return token.endsWith("%") ? (value / 100) * scale : value;
}

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function oklabToLinear(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function linearToOklab(r, g, b) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

const inGamut = (rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);

/** OKLCH to linear sRGB; a color outside sRGB loses chroma until it fits. */
function oklchToLinear(L, C, H) {
  const cos = Math.cos((H * Math.PI) / 180);
  const sin = Math.sin((H * Math.PI) / 180);
  let rgb = oklabToLinear(L, C * cos, C * sin);
  if (inGamut(rgb)) return rgb;
  let low = 0;
  let high = C;
  for (let i = 0; i < 18; i++) {
    const mid = (low + high) / 2;
    rgb = oklabToLinear(L, mid * cos, mid * sin);
    if (inGamut(rgb)) low = mid;
    else high = mid;
  }
  return oklabToLinear(L, low * cos, low * sin);
}

const fromLinear = (rgb, a) => ({ r: clamp(toGamma(rgb[0])), g: clamp(toGamma(rgb[1])), b: clamp(toGamma(rgb[2])), a });

let canvas = null;

/** Any other CSS color: let the browser paint one pixel and read it back. */
function paint(value) {
  canvas ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  canvas.canvas.width = 1;
  canvas.canvas.height = 1;
  canvas.clearRect(0, 0, 1, 1);
  canvas.fillStyle = "#000";
  canvas.fillStyle = value;
  canvas.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
  return { r: r / 255, g: g / 255, b: b / 255, a: a / 255 };
}

/**
 * A CSS color (as getComputedStyle reports it) to { r, g, b, a }, each 0–1,
 * r/g/b gamma-encoded sRGB.
 */
export function parseColor(value) {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text || text === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  const hex = text.match(/^#([0-9a-f]{3,8})$/);
  if (hex) {
    let digits = hex[1];
    if (digits.length <= 4) digits = [...digits].map((d) => d + d).join("");
    const part = (i) => Number.parseInt(digits.slice(i, i + 2), 16) / 255;
    return { r: part(0), g: part(2), b: part(4), a: digits.length === 8 ? part(6) : 1 };
  }

  const fn = text.match(/^([a-z-]+)\((.*)\)$/);
  if (fn) {
    const [body, alphaPart] = fn[2].split("/");
    const parts = body.replaceAll(",", " ").trim().split(/\s+/);
    let a = alphaPart === undefined ? 1 : clamp(number(alphaPart.trim()));
    switch (fn[1]) {
      case "rgb":
      case "rgba":
        if (alphaPart === undefined && parts.length === 4) a = clamp(number(parts[3]));
        return {
          r: clamp(number(parts[0], 255) / 255),
          g: clamp(number(parts[1], 255) / 255),
          b: clamp(number(parts[2], 255) / 255),
          a,
        };
      case "oklch":
        return fromLinear(oklchToLinear(number(parts[0]), number(parts[1], 0.4), number(parts[2])), a);
      case "oklab":
        return fromLinear(oklabToLinear(number(parts[0]), number(parts[1], 0.4), number(parts[2], 0.4)), a);
      case "color":
        if (parts[0] === "srgb") {
          return { r: clamp(number(parts[1])), g: clamp(number(parts[2])), b: clamp(number(parts[3])), a };
        }
        if (parts[0] === "srgb-linear") {
          return fromLinear([number(parts[1]), number(parts[2]), number(parts[3])], a);
        }
        break;
      default:
    }
  }
  return paint(text);
}

/** "#rrggbb" when opaque, "rgba(r, g, b, a)" otherwise. */
export function formatColor({ r, g, b, a }) {
  const byte = (v) => Math.round(clamp(v) * 255);
  if (a <= 0.001) return "transparent";
  if (a >= 0.999) return "#" + [r, g, b].map((v) => byte(v).toString(16).padStart(2, "0")).join("");
  return `rgba(${byte(r)}, ${byte(g)}, ${byte(b)}, ${Math.round(a * 1000) / 1000})`;
}

/** Plain CSS color for a computed one. */
export const toPlainColor = (value) => formatColor(parseColor(value));

/** WCAG relative luminance of an opaque color. */
export function luminance({ r, g, b }) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * A near-white surface (a code block, a table header) as a veil of mid grey:
 * the same color on white, written as a translucent one.
 *
 * WeChat's dark mode dims an opaque light grey to a still light grey and
 * turns the text on it dark, a bright patch on the dark page. A veil is
 * weighed with its transparency, stays a faint tint of the dark ground, and
 * keeps its text light. Other colors come back unchanged.
 */
export function veil(color) {
  if (color.a < 0.999) return color;
  const gaps = [1 - color.r, 1 - color.g, 1 - color.b];
  const widest = Math.max(...gaps);
  if (widest > 0.2 || widest < 0.004) return color; // not light, or plain white
  // Mid grey where the tint allows it; a stronger tint needs a denser veil.
  const a = Math.max((gaps[0] + gaps[1] + gaps[2]) / 1.5, widest);
  return { r: 1 - gaps[0] / a, g: 1 - gaps[1] / a, b: 1 - gaps[2] / a, a };
}

/**
 * The luminance at which a tone has the same contrast against both of
 * WeChat's grounds (about 0.2, a contrast of 4.2 on each): the most a single
 * image color can keep in both modes.
 */
export function balancedLuminance() {
  const light = luminance(parseColor(GROUND.light)) + 0.05;
  const dark = luminance(parseColor(GROUND.dark)) + 0.05;
  return Math.sqrt(light * dark) - 0.05;
}

/**
 * The same hue and chroma moved to a luminance, so a theme color keeps its
 * character while becoming readable on both grounds.
 */
export function balance(color, target = balancedLuminance()) {
  const [, a, b] = linearToOklab(toLinear(color.r), toLinear(color.g), toLinear(color.b));
  const chroma = Math.hypot(a, b);
  const hue = (Math.atan2(b, a) * 180) / Math.PI;
  let low = 0;
  let high = 1;
  let result = color;
  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    result = fromLinear(oklchToLinear(mid, chroma, hue), 1);
    if (luminance(result) < target) low = mid;
    else high = mid;
  }
  return { ...result, a: 1 };
}
