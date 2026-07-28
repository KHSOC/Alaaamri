
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

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

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
      try {
        localStorage.setItem("siteLanguage", language);
      } catch (_) {}
    });
  });

  const searchInput = document.querySelector("[data-tool-search]");
  const mainFilterButtons = [...document.querySelectorAll("[data-main-filter]")];
  const aiSubfilterButtons = [...document.querySelectorAll("[data-ai-subfilter]")];
  const aiSubfilterPanel = document.querySelector("[data-ai-subfilters]");
  const toolCards = [...document.querySelectorAll("[data-tool]")];
  const toolGroups = [...document.querySelectorAll("[data-tool-group]")];
  const directorySections = [...document.querySelectorAll("[data-directory-section]")];
  const resultCount = document.querySelector("[data-result-count]");
  const pageLanguage = document.documentElement.lang === "ar" ? "ar" : "en";

  let activeMainFilter = "all";
  let activeAiSubfilter = "all";

  const updateCount = (visible) => {
    if (!resultCount) return;
    resultCount.textContent = pageLanguage === "ar"
      ? `${visible} أداة معروضة`
      : `${visible} tool${visible === 1 ? "" : "s"} displayed`;
  };

  const setPressedState = (buttons, selectedButton) => {
    buttons.forEach((button) => {
      const selected = button === selectedButton;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  };

  const applyDirectoryFilters = () => {
    if (!toolCards.length) return;

    const query = (searchInput?.value || "")
      .trim()
      .toLocaleLowerCase(pageLanguage);

    let visibleCount = 0;

    toolCards.forEach((card) => {
      const text = card.textContent.toLocaleLowerCase(pageLanguage);
      const mainCategory = card.dataset.mainCategory || "";
      const subcategory = card.dataset.subcategory || "";

      const matchesQuery = text.includes(query);
      const matchesMain =
        activeMainFilter === "all" || mainCategory === activeMainFilter;
      const matchesSubcategory =
        activeMainFilter !== "ai" ||
        activeAiSubfilter === "all" ||
        subcategory === activeAiSubfilter;

      const shouldShow = matchesQuery && matchesMain && matchesSubcategory;
      card.hidden = !shouldShow;

      if (shouldShow) visibleCount += 1;
    });

    toolGroups.forEach((group) => {
      const visibleCards = group.querySelectorAll("[data-tool]:not([hidden])");
      group.hidden = visibleCards.length === 0;
    });

    directorySections.forEach((section) => {
      const category = section.dataset.directorySection;
      const visibleCards = section.querySelectorAll("[data-tool]:not([hidden])");

      const mainAllowsSection =
        activeMainFilter === "all" || activeMainFilter === category;

      section.hidden = !mainAllowsSection || visibleCards.length === 0;
    });

    if (aiSubfilterPanel) {
      aiSubfilterPanel.hidden = activeMainFilter !== "ai";
    }

    updateCount(visibleCount);
  };

  mainFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeMainFilter = button.dataset.mainFilter || "all";

      if (activeMainFilter !== "ai") {
        activeAiSubfilter = "all";
        const allAiButton = aiSubfilterButtons.find(
          (item) => item.dataset.aiSubfilter === "all"
        );
        if (allAiButton) setPressedState(aiSubfilterButtons, allAiButton);
      }

      setPressedState(mainFilterButtons, button);
      applyDirectoryFilters();
    });
  });

  aiSubfilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeMainFilter = "ai";
      activeAiSubfilter = button.dataset.aiSubfilter || "all";

      const aiMainButton = mainFilterButtons.find(
        (item) => item.dataset.mainFilter === "ai"
      );
      if (aiMainButton) setPressedState(mainFilterButtons, aiMainButton);

      setPressedState(aiSubfilterButtons, button);
      applyDirectoryFilters();
    });
  });

  searchInput?.addEventListener("input", applyDirectoryFilters);
  applyDirectoryFilters();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js?v=8");
      registration.update().catch(() => {});
    } catch (error) {
      console.warn("Service worker registration failed:", error);
    }
  });
}
