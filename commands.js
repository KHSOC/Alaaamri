
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const cards = [...document.querySelectorAll("[data-command-card]")];
  if (!cards.length) return;

  const platformButtons = [...document.querySelectorAll("[data-command-filter]")];
  const letterButtons = [...document.querySelectorAll("[data-letter-filter]")];
  const search = document.querySelector("[data-command-search]");
  const favoritesButton = document.querySelector("[data-favorites-filter]");
  const count = document.querySelector("[data-command-count]");
  const empty = document.querySelector("[data-command-empty]");
  const language = document.documentElement.lang === "ar" ? "ar" : "en";

  let platform = "all";
  let letter = "all";
  let favoritesOnly = false;
  let favorites = new Set();

  try {
    favorites = new Set(JSON.parse(localStorage.getItem("commandFavorites") || "[]"));
  } catch (_) {
    favorites = new Set();
  }

  const commandId = (card) => card.id || "";

  const updateFavoriteButtons = () => {
    cards.forEach((card) => {
      let button = card.querySelector("[data-favorite-command]");
      if (!button) {
        button = document.createElement("button");
        button.type = "button";
        button.className = "favorite-command";
        button.dataset.favoriteCommand = commandId(card);
        button.setAttribute("aria-label", language === "ar" ? "إضافة إلى المفضلة" : "Add to favorites");
        card.querySelector(".command-card-top")?.append(button);
      }

      const selected = favorites.has(commandId(card));
      button.textContent = selected ? "★" : "☆";
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
      button.setAttribute(
        "aria-label",
        selected
          ? (language === "ar" ? "إزالة من المفضلة" : "Remove from favorites")
          : (language === "ar" ? "إضافة إلى المفضلة" : "Add to favorites")
      );
    });
  };

  const persistFavorites = () => {
    try {
      localStorage.setItem("commandFavorites", JSON.stringify([...favorites]));
    } catch (_) {}
  };

  const setActive = (buttons, selected) => {
    buttons.forEach((button) => {
      const active = button === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const applyFilters = () => {
    const query = (search?.value || "").trim().toLocaleLowerCase(language);
    let visible = 0;

    cards.forEach((card) => {
      const matchesPlatform = platform === "all" || card.dataset.platform === platform;
      const matchesLetter = letter === "all" || card.dataset.letter === letter;
      const matchesSearch = (card.dataset.search || "").includes(query);
      const matchesFavorite = !favoritesOnly || favorites.has(commandId(card));

      const show = matchesPlatform && matchesLetter && matchesSearch && matchesFavorite;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) {
      count.textContent = language === "ar"
        ? `${visible} أمرًا معروضًا`
        : `${visible} command${visible === 1 ? "" : "s"} displayed`;
    }

    if (empty) empty.hidden = visible !== 0;
  };

  platformButtons.forEach((button) => {
    button.addEventListener("click", () => {
      platform = button.dataset.commandFilter || "all";
      setActive(platformButtons, button);
      applyFilters();
    });
  });

  letterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      letter = button.dataset.letterFilter || "all";
      setActive(letterButtons, button);
      applyFilters();
    });
  });

  favoritesButton?.addEventListener("click", () => {
    favoritesOnly = !favoritesOnly;
    favoritesButton.classList.toggle("active", favoritesOnly);
    favoritesButton.setAttribute("aria-pressed", String(favoritesOnly));
    applyFilters();
  });

  search?.addEventListener("input", applyFilters);

  document.addEventListener("click", async (event) => {
    const copyButton = event.target.closest("[data-copy-command]");
    if (copyButton) {
      const original = copyButton.dataset.copyDefault || copyButton.textContent;
      const success = copyButton.dataset.copySuccess || "Copied";
      try {
        await navigator.clipboard.writeText(copyButton.dataset.copyCommand || "");
        copyButton.textContent = success;
        window.setTimeout(() => {
          copyButton.textContent = original;
        }, 1400);
      } catch (_) {
        copyButton.textContent = language === "ar" ? "تعذر النسخ" : "Copy failed";
        window.setTimeout(() => {
          copyButton.textContent = original;
        }, 1400);
      }
      return;
    }

    const favoriteButton = event.target.closest("[data-favorite-command]");
    if (favoriteButton) {
      const id = favoriteButton.dataset.favoriteCommand;
      if (favorites.has(id)) {
        favorites.delete(id);
      } else {
        favorites.add(id);
      }
      persistFavorites();
      updateFavoriteButtons();
      applyFilters();
    }
  });

  updateFavoriteButtons();
  applyFilters();
});
