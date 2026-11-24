/**
 * Inline images (icon-sized pictures in a line of text) can be seen larger:
 * hovering with a mouse, or tapping on a touch screen, shows an enlarged copy
 * floating over the image. It goes away when the pointer leaves, on the next
 * tap, on scroll, or after a few seconds on touch.
 *
 * The copy is one fixed-position element on <body>, so it is never clipped
 * by a scrolling table or a rounded card the image sits in. One delegated
 * set of listeners covers images inserted later as well.
 */
const SCALE = 3.2;
const AUTO_CLOSE_MS = 4000;

export function initInlineZoom() {
  let float = null;
  let current = null;
  let timer = 0;
  let openedAt = 0;

  const ensureFloat = () => {
    if (float) return float;
    float = document.createElement("img");
    float.className = "inline-zoom";
    float.alt = "";
    float.setAttribute("aria-hidden", "true");
    float.decoding = "async";
    document.body.append(float);
    return float;
  };

  const show = (img) => {
    const el = ensureFloat();
    const rect = img.getBoundingClientRect();
    const width = rect.width * SCALE;
    const height = rect.height * SCALE;
    const margin = 8;
    const left = Math.min(Math.max(rect.left + rect.width / 2 - width / 2, margin), window.innerWidth - width - margin);
    const top = Math.min(Math.max(rect.top + rect.height / 2 - height / 2, margin), window.innerHeight - height - margin);
    el.src = img.currentSrc || img.src;
    el.style.cssText = `left:${left}px;top:${top}px;width:${width}px;height:${height}px;` +
      `transform-origin:${rect.left + rect.width / 2 - left}px ${rect.top + rect.height / 2 - top}px`;
    current = img;
    openedAt = window.scrollY;
    el.dataset.open = "";
  };

  const hide = () => {
    window.clearTimeout(timer);
    current = null;
    if (float) delete float.dataset.open;
  };

  const target = (event) =>
    event.target instanceof Element ? event.target.closest(".inline-image") : null;

  document.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") return;
    const img = target(event);
    if (img && img !== current) show(img);
  });
  document.addEventListener("pointerout", (event) => {
    if (event.pointerType !== "mouse") return;
    if (target(event) && target(event) === current) hide();
  });

  document.addEventListener("pointerup", (event) => {
    if (event.pointerType === "mouse") return;
    const img = target(event);
    if (!img || img === current) {
      hide();
      return;
    }
    show(img);
    window.clearTimeout(timer);
    timer = window.setTimeout(hide, AUTO_CLOSE_MS);
  });

  // A real scroll closes it; tiny scroll-anchoring nudges (content loading
  // above) do not.
  window.addEventListener("scroll", () => {
    if (current && Math.abs(window.scrollY - openedAt) > 24) hide();
  }, { passive: true });
}
