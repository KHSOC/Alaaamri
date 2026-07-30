"use strict";

window.khalidCopyText = async (value) => {
  const text = String(value || "");

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {}

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  area.style.pointerEvents = "none";
  document.body.append(area);
  area.select();
  area.setSelectionRange(0, area.value.length);

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (_) {}

  area.remove();
  return copied;
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("menu-open");

  const menuButton = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");

  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!menuButton || !nav) return;
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    if (restoreFocus) menuButton.focus();
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));

      if (isOpen) {
        requestAnimationFrame(() => nav.querySelector("a")?.focus());
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        closeMenu({ restoreFocus: true });
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(event.target) || menuButton.contains(event.target)) return;
      closeMenu();
    });

    matchMedia("(min-width: 1181px)").addEventListener("change", (event) => {
      if (event.matches) closeMenu();
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
  let clockTimer = 0;

  const clocks = clockWidgets.map((widget) => {
    const locale = widget.dataset.locale || "en-US";
    return {
      widget,
      timeElement: widget.querySelector("[data-clock-time]"),
      dateElement: widget.querySelector("[data-clock-date]"),
      timeFormatter: new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Riyadh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: locale.startsWith("en")
      }),
      dateFormatter: new Intl.DateTimeFormat(locale, {
        timeZone: "Asia/Riyadh",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    };
  });

  const updateClocks = () => {
    const now = new Date();
    const iso = now.toISOString();

    clocks.forEach(({ timeElement, dateElement, timeFormatter, dateFormatter }) => {
      if (timeElement) {
        timeElement.textContent = timeFormatter.format(now);
        timeElement.setAttribute("datetime", iso);
      }
      if (dateElement) {
        dateElement.textContent = dateFormatter.format(now);
        dateElement.setAttribute("datetime", iso);
      }
    });
  };

  const scheduleClock = () => {
    window.clearTimeout(clockTimer);
    if (!clocks.length || document.hidden) return;
    updateClocks();
    const delay = 1000 - (Date.now() % 1000) + 20;
    clockTimer = window.setTimeout(scheduleClock, delay);
  };

  if (clocks.length) {
    scheduleClock();
    document.addEventListener("visibilitychange", scheduleClock);
  }

  const sectionJumpLinks = [...document.querySelectorAll("[data-section-jump]")];

  const setActiveSectionLink = (activeLink) => {
    sectionJumpLinks.forEach((item) => {
      const active = item === activeLink;
      item.classList.toggle("active", active);
      if (active) item.setAttribute("aria-current", "location");
      else item.removeAttribute("aria-current");
    });

    if (activeLink && matchMedia("(max-width: 900px)").matches) {
      const scroller = activeLink.closest(".hub-sidebar");
      if (scroller) {
        const scrollerRect = scroller.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const delta =
          (linkRect.left + linkRect.width / 2) -
          (scrollerRect.left + scrollerRect.width / 2);
        const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

        scroller.scrollBy({
          left: delta,
          top: 0,
          behavior: reducedMotion ? "auto" : "smooth"
        });
      }
    }
  };

  sectionJumpLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveSectionLink(link);
      closeMenu();
    });
  });

  const sectionTargets = sectionJumpLinks
    .map((link) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return null;
      const target = document.querySelector(href);
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  const directoryTarget = document.querySelector("#tech-directory");

  if ("IntersectionObserver" in window && (sectionTargets.length || directoryTarget)) {
    const observed = [
      ...(directoryTarget ? [{ link: null, target: directoryTarget }] : []),
      ...sectionTargets
    ];

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));

      if (!visibleEntries.length) return;

      const match = observed.find(({ target }) => target === visibleEntries[0].target);
      setActiveSectionLink(match?.link || null);
    }, {
      rootMargin: "-28% 0px -58% 0px",
      threshold: 0
    });

    observed.forEach(({ target }) => observer.observe(target));
  }

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

  const normalize = (value) => String(value || "")
    .normalize("NFKD")
    .replace(/[\u0640\u064B-\u065F\u0670]/g, "")
    .toLocaleLowerCase(language)
    .trim();

  const cardSearchText = new Map(
    cards.map((card) => [card, normalize(card.textContent)])
  );

  let mainFilter = "all";
  let aiFilter = "all";
  let programFilter = "all";
  let filterFrame = 0;

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

  const updateCount = (value) => {
    if (!resultCount) return;
    resultCount.textContent = language === "ar"
      ? `${value} أداة معروضة`
      : `${value} tool${value === 1 ? "" : "s"} displayed`;
  };

  const applyFilters = () => {
    if (!cards.length) return;
    const query = normalize(searchInput?.value || "");
    let visible = 0;

    cards.forEach((card) => {
      const mainCategory = card.dataset.mainCategory || "";
      const aiCategory = card.dataset.subcategory || "";
      const programCategory = card.dataset.programCategory || "";

      const matchesSearch = !query || cardSearchText.get(card).includes(query);
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
      group.hidden = !group.querySelector("[data-tool]:not([hidden])");
    });

    sections.forEach((section) => {
      const category = section.dataset.directorySection;
      const hasVisibleCards = Boolean(section.querySelector("[data-tool]:not([hidden])"));
      const allowed = mainFilter === "all" || mainFilter === category;
      section.hidden = !allowed || !hasVisibleCards;
    });

    if (aiPanel) aiPanel.hidden = mainFilter !== "ai";
    if (programPanel) programPanel.hidden = mainFilter !== "programs";
    updateCount(visible);
  };

  const scheduleFilters = () => {
    cancelAnimationFrame(filterFrame);
    filterFrame = requestAnimationFrame(applyFilters);
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
      scheduleFilters();
    });
  });

  aiButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mainFilter = "ai";
      aiFilter = button.dataset.aiSubfilter || "all";
      const aiMain = mainButtons.find((item) => item.dataset.mainFilter === "ai");
      if (aiMain) setActive(mainButtons, aiMain);
      setActive(aiButtons, button);
      scheduleFilters();
    });
  });

  programButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mainFilter = "programs";
      programFilter = button.dataset.programSubfilter || "all";
      const programsMain = mainButtons.find((item) => item.dataset.mainFilter === "programs");
      if (programsMain) setActive(mainButtons, programsMain);
      setActive(programButtons, button);
      scheduleFilters();
    });
  });

  searchInput?.addEventListener("input", scheduleFilters);
  scheduleFilters();
});


window.addEventListener("pageshow", () => {
  document.body.classList.remove("menu-open");
  document.querySelector("[data-nav]")?.classList.remove("open");
  document.querySelector("[data-menu]")?.setAttribute("aria-expanded", "false");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js?v=23");
      registration.update().catch(() => {});
    } catch (error) {
      console.warn("Service worker registration failed:", error);
    }
  });
}
