
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(event.target) || menuButton.contains(event.target)) return;
      closeMenu();
    });
  }

  const languageCards = [...document.querySelectorAll("[data-language-choice]")];
  let savedLanguage = "";
  try {
    savedLanguage = localStorage.getItem("siteLanguage") || "";
  } catch (_) {}

  languageCards.forEach((card) => {
    const language = card.dataset.languageChoice;
    if (language === savedLanguage) {
      card.classList.add("recommended");
      card.setAttribute("aria-describedby", "saved-language-note");
    }
    card.addEventListener("click", () => {
      if (language !== "ar" && language !== "en") return;
      try { localStorage.setItem("siteLanguage", language); } catch (_) {}
    });
  });

  const searchInput = document.querySelector("[data-tool-search]");
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const toolCards = [...document.querySelectorAll("[data-tool]")];
  const resultCount = document.querySelector("[data-result-count]");
  const pageLanguage = document.documentElement.lang === "ar" ? "ar" : "en";
  let activeCategory = "all";

  const updateCount = (visible) => {
    if (!resultCount) return;
    resultCount.textContent = pageLanguage === "ar"
      ? `${visible} أداة معروضة`
      : `${visible} tool${visible === 1 ? "" : "s"} displayed`;
  };

  const applyFilters = () => {
    const query = (searchInput?.value || "").trim().toLocaleLowerCase(pageLanguage);
    let visible = 0;

    toolCards.forEach((card) => {
      const text = card.textContent.toLocaleLowerCase(pageLanguage);
      const category = card.dataset.category || "";
      const matchesText = text.includes(query);
      const matchesCategory = activeCategory === "all" || category === activeCategory;
      const show = matchesText && matchesCategory;
      card.hidden = !show;
      if (show) visible += 1;
    });

    updateCount(visible);
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const requestedCategory = button.dataset.filter || "all";
      const validCategory = filterButtons.some((item) => item.dataset.filter === requestedCategory);
      activeCategory = validCategory ? requestedCategory : "all";

      filterButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
  applyFilters();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js?v=7");
      registration.update().catch(() => {});
    } catch (error) {
      console.warn("Service worker registration failed:", error);
    }
  });
}
