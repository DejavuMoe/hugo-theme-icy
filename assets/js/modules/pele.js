/**
 * Pele diagrams: mount every ```pele code block. The vendored library
 * (window.pele) is loaded as a deferred classic script before this module.
 * The diagram source stays in the page as the fallback: without JavaScript,
 * when the library fails to load, or when a diagram has a syntax error, the
 * source is shown as code.
 */
import { claim } from "./content-ready.js";

export function initPele(root = document) {
  const sources = claim(root, ".pele-figure > pre.pele-source", "pele");
  if (!sources.length) return;

  for (const source of sources) {
    const figure = source.closest(".pele-figure");
    if (!globalThis.pele?.mount) {
      figure.classList.add("is-source");
      continue;
    }
    const container = document.createElement("div");
    container.className = "pele-diagram";
    source.after(container);
    try {
      globalThis.pele.mount(container, source.textContent, {
        fontSize: Number.parseFloat(getComputedStyle(container).fontSize) || 15,
        config: { flowchart: { nodeSpacing: 28, rankSpacing: 40 } },
        links: false,
        images: false,
        zoom: {
          labels: {
            zoomIn: figure.dataset.labelZoomIn,
            zoomOut: figure.dataset.labelZoomOut,
            reset: figure.dataset.labelReset,
          },
        },
      });
      figure.classList.add("is-mounted");
    } catch (error) {
      container.remove();
      figure.classList.add("is-source");
      console.warn("[icy] Pele diagram could not be rendered:", error);
    }
  }
}
