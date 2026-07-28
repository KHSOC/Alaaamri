
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


  const clockWidgets = [...document.querySelectorAll("[data-clock]")];

  const updateClock = (widget) => {
    const locale = widget.dataset.locale || "en-US";
    const now = new Date();

    const timeElement = widget.querySelector("[data-clock-time]");
    const dateElement = widget.querySelector("[data-clock-date]");

    const timeFormatter = new Intl.DateTimeFormat(locale, {
      timeZone: "Asia/Riyadh",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: locale.startsWith("en")
    });

    const dateFormatter = new Intl.DateTimeFormat(locale, {
      timeZone: "Asia/Riyadh",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    if (timeElement) {
      timeElement.textContent = timeFormatter.format(now);
      timeElement.setAttribute("datetime", now.toISOString());
    }

    if (dateElement) {
      dateElement.textContent = dateFormatter.format(now);
      dateElement.setAttribute("datetime", now.toISOString());
    }
  };

  if (clockWidgets.length) {
    clockWidgets.forEach(updateClock);

    window.setInterval(() => {
      clockWidgets.forEach(updateClock);
    }, 1000);
  }


  const sectionJumpLinks = [...document.querySelectorAll("[data-section-jump]")];

  sectionJumpLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sectionJumpLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      closeMenu();
    });
  });

  const searchInput = document.querySelector("[data-tool-search]");
  const mainButtons = [...document.querySelectorAll("[data-main-filter]")];
  const aiButtons = [...document.querySelectorAll("[data-ai-subfilter]")];
  const programButtons = [...document.querySelectorAll("[data-program-subfilter]")];
  const aiPanel = document.querySelector("[data-ai-subfilters]");
  const programPanel = document.querySelector("[data-program-subfilters]");
  const cards = [...document.querySelectorAll("[data-tool]")];
  const groups = [...document.querySelectorAll("[data-tool-group]")];
  const sections = [...document.querySelectorAll("[data-directory-section]")];
  const resultCount = document.querySelector("[data-result-count]");
  const language = document.documentElement.lang === "ar" ? "ar" : "en";

  let mainFilter = "all";
  let aiFilter = "all";
  let programFilter = "all";

  const setActive = (buttons, activeButton) => {
    buttons.forEach((button) => {
      const active = button === activeButton;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const resetSubfilter = (buttons, dataKey) => {
    const allButton = buttons.find((button) => button.dataset[dataKey] === "all");
    if (allButton) setActive(buttons, allButton);
  };

  const updateCount = (count) => {
    if (!resultCount) return;
    resultCount.textContent = language === "ar"
      ? `${count} أداة معروضة`
      : `${count} tool${count === 1 ? "" : "s"} displayed`;
  };

  const applyFilters = () => {
    if (!cards.length) return;

    const query = (searchInput?.value || "")
      .trim()
      .toLocaleLowerCase(language);

    let visible = 0;

    cards.forEach((card) => {
      const text = card.textContent.toLocaleLowerCase(language);
      const mainCategory = card.dataset.mainCategory || "";
      const aiCategory = card.dataset.subcategory || "";
      const programCategory = card.dataset.programCategory || "";

      const matchesSearch = text.includes(query);
      const matchesMain = mainFilter === "all" || mainCategory === mainFilter;
      const matchesAi =
        mainCategory !== "ai" ||
        mainFilter !== "ai" ||
        aiFilter === "all" ||
        aiCategory === aiFilter;
      const matchesProgram =
        mainCategory !== "programs" ||
        mainFilter !== "programs" ||
        programFilter === "all" ||
        programCategory === programFilter;

      const show = matchesSearch && matchesMain && matchesAi && matchesProgram;
      card.hidden = !show;

      if (show) visible += 1;
    });

    groups.forEach((group) => {
      const visibleCards = group.querySelectorAll("[data-tool]:not([hidden])");
      group.hidden = visibleCards.length === 0;
    });

    sections.forEach((section) => {
      const category = section.dataset.directorySection;
      const visibleCards = section.querySelectorAll("[data-tool]:not([hidden])");
      const allowed = mainFilter === "all" || mainFilter === category;
      section.hidden = !allowed || visibleCards.length === 0;
    });

    if (aiPanel) aiPanel.hidden = mainFilter !== "ai";
    if (programPanel) programPanel.hidden = mainFilter !== "programs";

    updateCount(visible);
  };

  mainButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mainFilter = button.dataset.mainFilter || "all";

      if (mainFilter !== "ai") {
        aiFilter = "all";
        resetSubfilter(aiButtons, "aiSubfilter");
      }

      if (mainFilter !== "programs") {
        programFilter = "all";
        resetSubfilter(programButtons, "programSubfilter");
      }

      setActive(mainButtons, button);
      applyFilters();
    });
  });

  aiButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mainFilter = "ai";
      aiFilter = button.dataset.aiSubfilter || "all";

      const aiMainButton = mainButtons.find(
        (item) => item.dataset.mainFilter === "ai"
      );

      if (aiMainButton) setActive(mainButtons, aiMainButton);
      setActive(aiButtons, button);
      applyFilters();
    });
  });

  programButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mainFilter = "programs";
      programFilter = button.dataset.programSubfilter || "all";

      const programsMainButton = mainButtons.find(
        (item) => item.dataset.mainFilter === "programs"
      );

      if (programsMainButton) setActive(mainButtons, programsMainButton);
      setActive(programButtons, button);
      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
  applyFilters();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js?v=14");
      registration.update().catch(() => {});
    } catch (error) {
      console.warn("Service worker registration failed:", error);
    }
  });
}
