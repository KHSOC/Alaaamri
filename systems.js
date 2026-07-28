"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const logoImages = [...document.querySelectorAll("[data-os-logo]")];
  logoImages.forEach((image) => {
    image.addEventListener("error", () => {
      const fallback = image.dataset.logoFallback;
      if (fallback && image.getAttribute("src") !== fallback) {
        image.setAttribute("src", fallback);
        image.classList.add("using-logo-fallback");
      }
    }, { once: true });
  });

  const cards = [...document.querySelectorAll("[data-os-card]")];
  if (!cards.length) return;

  const filters = [...document.querySelectorAll("[data-os-filter]")];
  const search = document.querySelector("[data-os-search]");
  const count = document.querySelector("[data-os-count]");
  const empty = document.querySelector("[data-os-empty]");
  const language = document.documentElement.lang === "ar" ? "ar" : "en";

  const normalize = (value) => String(value || "")
    .normalize("NFKD")
    .replace(/[\u0640\u064B-\u065F\u0670]/g, "")
    .toLocaleLowerCase(language)
    .trim();

  const searchText = new Map(
    cards.map((card) => [card, normalize(card.dataset.osSearch)])
  );

  let category = "all";
  let frame = 0;

  const setActive = (selected) => {
    filters.forEach((button) => {
      const active = button === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const apply = () => {
    const query = normalize(search?.value || "");
    let visible = 0;

    cards.forEach((card) => {
      const matchesCategory = category === "all" || card.dataset.osCategory === category;
      const matchesSearch = !query || searchText.get(card).includes(query);
      const show = matchesCategory && matchesSearch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) {
      count.textContent = language === "ar"
        ? `${visible} نظامًا معروضًا`
        : `${visible} system${visible === 1 ? "" : "s"} displayed`;
    }
    if (empty) empty.hidden = visible !== 0;
  };

  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(apply);
  };

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.osFilter || "all";
      setActive(button);
      schedule();
    });
  });

  search?.addEventListener("input", schedule);
  schedule();
});
