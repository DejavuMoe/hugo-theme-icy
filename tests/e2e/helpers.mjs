/** Shared helpers for the browser checks. */

/** Pages every check visits: one of each layout, the heaviest showcases, both languages. */
export const PAGES = [
  "/",
  "/posts/",
  "/posts/markdown-and-typography/",
  "/posts/images-and-galleries/",
  "/posts/live-photos/",
  "/posts/audio-and-video/",
  "/posts/code-and-diagrams/",
  "/posts/writing-tools/",
  "/posts/secret-garden/",
  "/docs/",
  "/docs/installation/",
  "/docs/media/",
  "/search/",
  "/tags/",
  "/friends/",
  "/changelog/",
  "/zh-cn/",
  "/zh-cn/posts/markdown-and-typography/",
  "/missing-page/",
];

export const WIDTHS = [390, 1280];
export const SCHEMES = ["light", "dark"];

export const viewport = (width) => ({ width, height: width < 600 ? 844 : 800 });

/**
 * Keep the checks offline: requests to other hosts (analytics, comments)
 * get an empty response instead of reaching the network.
 */
export async function isolate(page) {
  await page.route(
    (url) => url.hostname !== "127.0.0.1",
    (route) => route.fulfill({ status: 200, body: "", contentType: route.request().resourceType() === "script" ? "text/javascript" : "text/plain" }),
  );
}

/** Browser messages that say nothing about the theme. */
const NOISE = [
  /^Button failed to load, iconName = /, // WebKitGTK's own media controls
  /^Prefetch request denied: URL must be secure/, // WebKit prefetches over HTTPS only; tests use HTTP
];

/**
 * Collect uncaught exceptions and console errors. `notFound`: the page is
 * expected to arrive with status 404 (the browser logs that as an error).
 */
export function watchErrors(page, { notFound = false } = {}) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (NOISE.some((pattern) => pattern.test(text))) return;
    if (notFound && /status of 404/.test(text)) return;
    errors.push(`console: ${text}`);
  });
  return errors;
}

/** Scroll to the end and back, so lazy images, diagrams and players load. */
export async function scrollThrough(page) {
  await page.evaluate(async () => {
    const frame = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 40)));
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.75) {
      window.scrollTo({ top: y, behavior: "instant" });
      await frame();
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await frame();
  });
}

/**
 * Elements that make the page scroll sideways (empty when it doesn't).
 * Content inside its own scroll container (code, tables) doesn't count.
 */
export async function overflowing(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    if (root.scrollWidth <= root.clientWidth) return [];
    const width = root.clientWidth;
    const clipped = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).overflowX !== "visible") return true;
      }
      return false;
    };
    return [...document.body.querySelectorAll("*")]
      .filter((el) => el.getBoundingClientRect().right > width + 1 && !clipped(el))
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${el.className && typeof el.className === "string" ? `.${el.className.trim().split(/\s+/).join(".")}` : ""}`);
  });
}

/**
 * A compact full-page screenshot for the report. Pages taller than WebKit
 * can capture (32,767 device pixels) get their first screen only.
 */
export async function attachScreenshot(page, testInfo, name) {
  if (process.env.SCREENSHOTS === "0") return;
  const pixels = await page.evaluate(() => document.documentElement.scrollHeight * devicePixelRatio);
  await testInfo.attach(name, {
    body: await page.screenshot({ fullPage: pixels <= 32000, type: "jpeg", quality: 60, animations: "disabled" }),
    contentType: "image/jpeg",
  });
}
