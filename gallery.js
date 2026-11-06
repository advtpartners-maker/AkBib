"use strict";

(() => {
  const slides = [
    ["1.png", "Библия", "Bible"],
    ["2.png", "Сравнение переводов", "Translation comparison"],
    ["3.png", "Словарь", "Dictionary"],
    ["4.png", "Комментарий", "Commentary"],
    ["5.png", "Книги", "Books"],
    ["6.png", "Лексикон", "Lexicon"],
    ["7.png", "Разночтения", "Textual variants"],
    ["8.png", "Структура", "Structure"],
    ["9.png", "Атласы", "Atlases"],
    ["10.png", "Хроники", "Chronicles"],
    ["11.png", "Ежедневные чтения", "Daily readings"],
    ["12.png", "Планы чтения", "Reading plans"],
    ["13.png", "Материалы", "Resources"],
    ["14.png", "Заметки", "Notes"],
    ["15.png", "Список задач", "Task list"],
    ["16.png", "Закладки", "Bookmarks"],
    ["17.png", "Поиск", "Search"]
  ];
  const gallery = document.querySelector(".screenshot-gallery");
  const image = gallery.querySelector("#gallery-image");
  const stage = gallery.querySelector(".gallery-stage");
  const choices = gallery.querySelector(".gallery-choices");
  const previous = gallery.querySelector(".gallery-prev");
  const next = gallery.querySelector(".gallery-next");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let request = 0;
  let animations = [];
  let outgoing;

  const buttons = slides.map((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-controls", "gallery-image");
    const thumbnail = document.createElement("img");
    thumbnail.src = "./assets/thumbnails/" + slide[0].replace(".png", ".webp");
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    thumbnail.decoding = "async";
    thumbnail.width = 120;
    thumbnail.height = 65;
    button.append(thumbnail);
    button.addEventListener("click", () => showSlide(index));
    choices.append(button);
    return button;
  });

  async function showSlide(index, reveal = true) {
    const direction = index < current ? -1 : 1;
    current = (index + slides.length) % slides.length;
    const selected = current;
    const token = ++request;
    animations.forEach(animation => animation.cancel());
    animations = [];
    outgoing?.remove();
    const slide = slides[selected];
    const url = new URL("./assets/screenshots/" + slide[0], document.baseURI).href;
    const changed = image.src !== url;
    if (changed) {
      // Decode before turning the frames so a slow image never flashes blank.
      const preload = new Image();
      preload.src = url;
      try { await preload.decode(); } catch (_) { return; }
      if (token !== request) return;
    }
    if (changed && !reducedMotion.matches) {
      outgoing = image.cloneNode();
      outgoing.removeAttribute("id");
      outgoing.setAttribute("aria-hidden", "true");
      outgoing.alt = "";
      outgoing.classList.add("gallery-outgoing");
      stage.append(outgoing);
    }
    const english = document.documentElement.lang === "en";
    const title = slide[english ? 2 : 1];
    if (changed) image.src = url;
    image.alt = english ? `AKAIO original screenshot: ${title}` : `Оригинальный скриншот AKAIO: ${title}`;
    stage.href = url;
    stage.setAttribute("aria-label", english ? `Open ${title}: original screenshot in a new tab` : `Открыть «${title}»: оригинальный скриншот в новой вкладке`);
    gallery.querySelector("#gallery-title").textContent = english ? "Explore the interface" : "Знакомство с интерфейсом";
    gallery.querySelector("#gallery-status").textContent = english ? `Screenshot ${selected + 1} of ${slides.length}: ${title}` : `Скриншот ${selected + 1} из ${slides.length}: ${title}`;
    gallery.setAttribute("aria-roledescription", english ? "carousel" : "карусель");
    choices.setAttribute("aria-label", english ? "Choose an application window" : "Выбрать окно программы");
    previous.setAttribute("aria-label", english ? "Previous screenshot" : "Предыдущий скриншот");
    next.setAttribute("aria-label", english ? "Next screenshot" : "Следующий скриншот");
    buttons.forEach((button, i) => {
      button.title = slides[i][english ? 2 : 1];
      button.setAttribute("aria-label", `${i + 1} / ${slides.length}: ${button.title}`);
      button.setAttribute("aria-pressed", String(i === current));
    });
    if (reveal) {
      const button = buttons[current];
      choices.scrollTo({ left: button.offsetLeft - (choices.clientWidth - button.offsetWidth) / 2, behavior: "instant" });
    }
    if (changed && !reducedMotion.matches) {
      const leaving = outgoing;
      animations = [
        image.animate([
          { transform: `translateX(${direction * 15}%) rotateY(${direction * 42}deg) scale(.86)`, opacity: 0 },
          { transform: "translateX(0) rotateY(0deg) scale(1)", opacity: 1 }
        ], { duration: 650, easing: "cubic-bezier(.22,.7,.2,1)" }),
        leaving.animate([
          { transform: "translateX(0) rotateY(0deg) scale(1)", opacity: 1 },
          { transform: `translateX(${-direction * 15}%) rotateY(${-direction * 42}deg) scale(.86)`, opacity: 0 }
        ], { duration: 500, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" })
      ];
      animations[1].finished.catch(() => {}).finally(() => leaving.remove());
    }
  }

  previous.addEventListener("click", () => showSlide(current - 1));
  next.addEventListener("click", () => showSlide(current + 1));
  gallery.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const index = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 }[event.key];
    if (index === undefined) return;
    event.preventDefault();
    showSlide(index);
    if (choices.contains(document.activeElement)) buttons[current].focus({ preventScroll: true });
  });

  let touchStart;
  let swiped = false;
  stage.addEventListener("touchstart", event => {
    swiped = false;
    touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener("touchmove", event => {
    if (event.touches.length !== 1) touchStart = null;
  }, { passive: true });
  stage.addEventListener("touchend", event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swiped = true;
      showSlide(current + (dx < 0 ? 1 : -1));
    }
    touchStart = null;
  }, { passive: true });
  stage.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });
  stage.addEventListener("click", event => {
    if (swiped) { event.preventDefault(); swiped = false; }
  });
  document.addEventListener("akaio-language-change", () => showSlide(current, false));
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      animations.forEach(animation => animation.cancel());
      outgoing?.remove();
    }
  });
  choices.hidden = false;
  gallery.classList.add("is-ready");
  showSlide(0, false);
})();
