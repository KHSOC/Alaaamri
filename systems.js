
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
  let category = "all";

  const setActive = (selected) => {
    filters.forEach((button) => {
      const active = button === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const apply = () => {
    const query = (search?.value || "").trim().toLocaleLowerCase(language);
    let visible = 0;

    cards.forEach((card) => {
      const matchesCategory = category === "all" || card.dataset.osCategory === category;
      const matchesSearch = (card.dataset.osSearch || "").includes(query);
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

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      category = button.dataset.osFilter || "all";
      setActive(button);
      apply();
    });
  });

  search?.addEventListener("input", apply);
  apply();
});
