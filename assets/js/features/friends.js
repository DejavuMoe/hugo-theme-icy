/* Feature bundle "friends": shows a friend's description below its card when
   there is no room above it in the window. Without JS it stays above. */

function place(card) {
  const tip = card?.querySelector(".friend-description");
  if (!tip) return;
  card.removeAttribute("data-below");
  const box = card.getBoundingClientRect();
  if (tip.getBoundingClientRect().top < 0 && innerHeight - box.bottom > box.top) {
    card.setAttribute("data-below", "");
  }
}

if (matchMedia("(hover: hover)").matches) {
  for (const list of document.querySelectorAll(".friends")) {
    list.addEventListener("pointerover", (event) => {
      const card = event.target.closest(".friend");
      if (!card?.contains(event.relatedTarget)) place(card);
    });
    list.addEventListener("focusin", (event) => place(event.target.closest(".friend")));
  }
}
