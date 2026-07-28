"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const data = Array.isArray(window.KHALID_COMMANDS) ? window.KHALID_COMMANDS : [];
  const grid = document.querySelector(".command-grid");
  if (!grid) return;

  const platformButtons = [...document.querySelectorAll("[data-command-filter]")];
  const letterIndex = document.querySelector(".letter-index");
  const search = document.querySelector("[data-command-search]");
  const favoritesButton = document.querySelector("[data-favorites-filter]");
  const count = document.querySelector("[data-command-count]");
  const empty = document.querySelector("[data-command-empty]");
  const loadMore = document.querySelector("[data-command-load-more]");
  const pageStatus = document.querySelector("[data-command-page-status]");
  const language = document.documentElement.lang === "ar" ? "ar" : "en";
  const pageSize = matchMedia("(max-width: 680px)").matches ? 18 : 36;

  const labels = language === "ar"
    ? {
        details: "عرض التفاصيل",
        syntax: "الصيغة",
        example: "مثال",
        copySyntax: "نسخ الصيغة",
        copyExample: "نسخ المثال",
        copied: "تم النسخ",
        copyFailed: "تعذر النسخ",
        addFavorite: "إضافة إلى المفضلة",
        removeFavorite: "إزالة من المفضلة",
        safe: "منخفض الخطورة",
        caution: "راجع قبل التنفيذ",
        danger: "قد يسبب حذفًا أو انقطاعًا",
        displayed: (value) => `${value} أمرًا معروضًا`,
        page: (shown, total) => `عرض ${shown} من ${total}`,
        noData: "تعذر تحميل بيانات الأوامر. حدّث الصفحة أو حاول لاحقًا."
      }
    : {
        details: "View details",
        syntax: "Syntax",
        example: "Example",
        copySyntax: "Copy syntax",
        copyExample: "Copy example",
        copied: "Copied",
        copyFailed: "Copy failed",
        addFavorite: "Add to favorites",
        removeFavorite: "Remove from favorites",
        safe: "Low risk",
        caution: "Review first",
        danger: "Potentially destructive",
        displayed: (value) => `${value} command${value === 1 ? "" : "s"} displayed`,
        page: (shown, total) => `Showing ${shown} of ${total}`,
        noData: "Command data could not be loaded. Refresh the page or try again later."
      };

  const normalize = (value) => String(value || "")
    .normalize("NFKD")
    .replace(/[\u0640\u064B-\u065F\u0670]/g, "")
    .toLocaleLowerCase(language)
    .trim();

  const searchableData = data.map((item) => ({
    ...item,
    searchText: normalize([
      item.command,
      item[`desc_${language}`],
      item.syntax,
      item.example,
      item.platform
    ].join(" "))
  }));

  let platform = "all";
  let letter = "all";
  let favoritesOnly = false;
  let visibleLimit = pageSize;
  let renderFrame = 0;
  let favorites = new Set();

  try {
    const stored = JSON.parse(localStorage.getItem("commandFavorites") || "[]");
    favorites = new Set(Array.isArray(stored) ? stored : []);
  } catch (_) {
    favorites = new Set();
  }

  const persistFavorites = () => {
    try {
      localStorage.setItem("commandFavorites", JSON.stringify([...favorites]));
    } catch (_) {}
  };

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const createCopyButton = (text, defaultLabel) => {
    const button = element("button", "", defaultLabel);
    button.type = "button";
    button.dataset.copyCommand = text;
    button.dataset.copyDefault = defaultLabel;
    button.dataset.copySuccess = labels.copied;
    button.setAttribute("aria-live", "polite");
    return button;
  };

  const createCodeBlock = (heading, code, buttonLabel) => {
    const block = element("div", "command-code-block");
    const header = element("div", "code-heading");
    header.append(element("span", "", heading), createCopyButton(code, buttonLabel));
    const pre = element("pre");
    pre.append(element("code", "", code));
    block.append(header, pre);
    return block;
  };

  const createCard = (item) => {
    const card = element("article", "command-card");
    card.id = item.id;
    card.dataset.commandCard = "";
    card.dataset.platform = item.platform;
    card.dataset.letter = item.letter;

    const top = element("div", "command-card-top");
    top.append(element("span", "platform-chip", {
      cmd: "CMD", powershell: "PS", linux: "LX", cisco: "CI",
      fortigate: "FG", docker: "DK", git: "GT"
    }[item.platform] || item.platform.toUpperCase()));

    const risk = element("span", `risk-badge risk-${item.risk}`, labels[item.risk] || labels.safe);
    top.append(risk);

    const favorite = element("button", "favorite-command", favorites.has(item.id) ? "★" : "☆");
    favorite.type = "button";
    favorite.dataset.favoriteCommand = item.id;
    favorite.classList.toggle("active", favorites.has(item.id));
    favorite.setAttribute("aria-pressed", String(favorites.has(item.id)));
    favorite.setAttribute(
      "aria-label",
      favorites.has(item.id) ? labels.removeFavorite : labels.addFavorite
    );
    top.append(favorite);

    const heading = element("h3");
    heading.append(element("code", "", item.command));

    const description = element("p", "", item[`desc_${language}`] || item.desc_en);

    const details = element("details", "command-details");
    details.append(element("summary", "", labels.details));
    details.append(
      createCodeBlock(labels.syntax, item.syntax, labels.copySyntax),
      createCodeBlock(labels.example, item.example, labels.copyExample)
    );

    card.append(top, heading, description, details);
    return card;
  };

  const setActive = (buttons, selected) => {
    buttons.forEach((button) => {
      const active = button === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const currentMatches = () => {
    const query = normalize(search?.value || "");
    return searchableData.filter((item) => {
      const matchesPlatform = platform === "all" || item.platform === platform;
      const matchesLetter = letter === "all" || item.letter === letter;
      const matchesQuery = !query || item.searchText.includes(query);
      const matchesFavorite = !favoritesOnly || favorites.has(item.id);
      return matchesPlatform && matchesLetter && matchesQuery && matchesFavorite;
    });
  };

  const render = () => {
    const matches = currentMatches();
    const visible = matches.slice(0, visibleLimit);
    const fragment = document.createDocumentFragment();

    visible.forEach((item) => fragment.append(createCard(item)));
    grid.replaceChildren(fragment);
    grid.setAttribute("aria-busy", "false");

    if (count) count.textContent = labels.displayed(matches.length);
    if (empty) empty.hidden = matches.length !== 0;
    if (loadMore) loadMore.hidden = visible.length >= matches.length;
    if (pageStatus) pageStatus.textContent = labels.page(visible.length, matches.length);
  };

  const scheduleRender = (resetLimit = false) => {
    if (resetLimit) visibleLimit = pageSize;
    cancelAnimationFrame(renderFrame);
    renderFrame = requestAnimationFrame(render);
  };

  const buildLetterIndex = () => {
    if (!letterIndex) return;
    const letters = [...new Set(data.map((item) => item.letter).filter(Boolean))].sort();
    const allButton = letterIndex.querySelector('[data-letter-filter="all"]');
    letters.forEach((value) => {
      const button = element("button", "letter-filter", value);
      button.type = "button";
      button.dataset.letterFilter = value;
      button.setAttribute("aria-pressed", "false");
      letterIndex.append(button);
    });

    letterIndex.addEventListener("click", (event) => {
      const button = event.target.closest("[data-letter-filter]");
      if (!button) return;
      letter = button.dataset.letterFilter || "all";
      setActive([...letterIndex.querySelectorAll("[data-letter-filter]")], button);
      scheduleRender(true);
    });

    if (allButton) allButton.setAttribute("aria-pressed", "true");
  };

  platformButtons.forEach((button) => {
    button.addEventListener("click", () => {
      platform = button.dataset.commandFilter || "all";
      setActive(platformButtons, button);
      scheduleRender(true);
    });
  });

  favoritesButton?.addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;
    favoritesButton.classList.toggle("active", favoritesOnly);
    favoritesButton.setAttribute("aria-pressed", String(favoritesOnly));
    scheduleRender(true);
  });

  search?.addEventListener("input", () => scheduleRender(true));

  loadMore?.addEventListener("click", () => {
    visibleLimit += pageSize;
    scheduleRender(false);
  });

  document.addEventListener("click", async (event) => {
    const copyButton = event.target.closest("[data-copy-command]");
    if (copyButton) {
      const original = copyButton.dataset.copyDefault || copyButton.textContent;
      const copied = window.khalidCopyText
        ? await window.khalidCopyText(copyButton.dataset.copyCommand || "")
        : false;
      copyButton.textContent = copied ? labels.copied : labels.copyFailed;
      window.setTimeout(() => { copyButton.textContent = original; }, 1400);
      return;
    }

    const favoriteButton = event.target.closest("[data-favorite-command]");
    if (!favoriteButton) return;
    const id = favoriteButton.dataset.favoriteCommand;
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    persistFavorites();
    scheduleRender(false);
  });

  buildLetterIndex();

  if (!data.length) {
    grid.setAttribute("aria-busy", "false");
    grid.replaceChildren(element("div", "empty-state", labels.noData));
    if (count) count.textContent = labels.displayed(0);
    return;
  }

  scheduleRender(true);
});
