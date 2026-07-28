
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const searchInput = document.querySelector("[data-tool-search]");
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const toolCards = [...document.querySelectorAll("[data-tool]")];

  let activeCategory = "all";

  const applyFilters = () => {
    const query = (searchInput?.value || "").trim().toLowerCase();

    toolCards.forEach((card) => {
      const cardText = card.textContent.toLowerCase();
      const category = card.dataset.category || "";
      const matchesSearch = cardText.includes(query);
      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      card.style.display = matchesSearch && matchesCategory ? "" : "none";
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
  applyFilters();
});

// Register the updated service worker after the page is fully loaded.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js?v=2");
    } catch (error) {
      console.warn("Service worker registration failed:", error);
    }
  });
}
