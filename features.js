"use strict";

(() => {
  const cards = [...document.querySelectorAll("#feature-grid .feature")];
  const controls = document.querySelector(".feature-pagination");
  const previous = controls.querySelector(".feature-prev");
  const next = controls.querySelector(".feature-next");
  const status = controls.querySelector(".feature-page");
  const pages = Math.ceil(cards.length / 3);
  let page = 0;

  function showPage() {
    cards.forEach((card, index) => { card.hidden = Math.floor(index / 3) !== page; });
    const english = document.documentElement.lang === "en";
    controls.setAttribute("aria-label", english ? "Feature card navigation" : "Навигация по карточкам");
    previous.setAttribute("aria-label", english ? "Previous cards" : "Предыдущие карточки");
    next.setAttribute("aria-label", english ? "Next cards" : "Следующие карточки");
    status.textContent = `${page + 1} / ${pages}`;
    status.setAttribute("aria-label", english ? `Page ${page + 1} of ${pages}` : `Страница ${page + 1} из ${pages}`);
  }

  previous.addEventListener("click", () => { page = (page - 1 + pages) % pages; showPage(); });
  next.addEventListener("click", () => { page = (page + 1) % pages; showPage(); });
  document.addEventListener("akaio-language-change", showPage);
  showPage();
  controls.hidden = false;

  const scene = document.querySelector(".study-scene");
  if (scene) {
    const syncScale = () => {
      scene.style.setProperty("--scene-scale", (scene.clientWidth / 1672).toFixed(6));
    };
    if (window.ResizeObserver) {
      new ResizeObserver(syncScale).observe(scene);
    } else {
      window.addEventListener("resize", syncScale, { passive: true });
    }
    syncScale();
  }
})();
