/**
 * Live Photos.
 *   - Desktop (fine pointer that can hover): hovering plays the clip muted.
 *   - Touch: press and hold plays it with sound until release.
 *   - The LIVE button plays it with sound (keyboard accessible); press again to stop.
 * A clip that ends or fails returns to the still. Starting playback with sound
 * announces itself, so other audible media on the page pause (media focus).
 * Reduced motion: no hover autoplay; explicit actions still work.
 */
import { claimMediaFocus, onMediaFocus } from "./media-focus.js";
import { claim } from "./content-ready.js";

const LONG_PRESS_MS = 300;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

export function initLivePhotos(root = document) {
  claim(root, "[data-live-photo]", "livephoto").forEach(setup);
}

function setup(figure) {
  const frame = figure.querySelector(".live-photo-frame");
  const video = figure.querySelector(".live-photo-video");
  const badge = figure.querySelector(".live-photo-badge");
  if (!frame || !video || !badge) return;

  let mode = null; // null | "preview" (muted) | "full" (with sound)

  const stop = () => {
    mode = null;
    video.pause();
    video.muted = true;
    figure.classList.remove("is-playing");
    badge.setAttribute("aria-pressed", "false");
  };

  const start = async (withSound) => {
    mode = withSound ? "full" : "preview";
    video.muted = !withSound;
    if (withSound) claimMediaFocus(video);
    try {
      video.currentTime = 0;
    } catch {
      // Not seekable before metadata loads; playback starts at 0 anyway.
    }
    figure.classList.add("is-playing");
    badge.setAttribute("aria-pressed", "true");
    try {
      await video.play();
    } catch {
      stop();
    }
  };

  video.addEventListener("ended", stop);
  video.addEventListener("error", () => {
    stop();
    figure.dataset.state = "error";
  });

  // Hover preview (muted).
  frame.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" && canHover.matches && !reduceMotion.matches && !mode) start(false);
  });
  frame.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && mode === "preview") stop();
  });

  // Press and hold (touch / pen) plays with sound.
  let timer = 0;
  let held = false;
  frame.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || event.target.closest(".live-photo-badge")) return;
    held = false;
    timer = window.setTimeout(() => {
      held = true;
      start(true);
    }, LONG_PRESS_MS);
  });
  const release = () => {
    window.clearTimeout(timer);
    timer = 0;
    if (held && mode === "full") stop();
  };
  frame.addEventListener("pointerup", release);
  frame.addEventListener("pointercancel", release);
  frame.addEventListener("contextmenu", (event) => {
    if (timer || held) event.preventDefault();
  });
  // A long press must not also open the viewer.
  frame.addEventListener("click", (event) => {
    if (held) {
      event.preventDefault();
      event.stopPropagation();
      held = false;
    }
  }, true);

  badge.addEventListener("click", (event) => {
    event.preventDefault();
    if (mode === "full") stop();
    else start(true);
  });

  onMediaFocus((owner) => {
    if (owner !== video && mode === "full") stop();
  });

  badge.hidden = false;
}
