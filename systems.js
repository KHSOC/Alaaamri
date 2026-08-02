"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const logoImages = [...document.querySelectorAll("[data-os-logo]")];

  const escapeXml = (value) => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

  const createFallbackLogo = (image) => {
    const label = (image.alt || "Operating System")
      .replace(/^شعار\s+/u, "")
      .replace(/\s+logo$/i, "")
      .trim();
    const words = label.match(/[\p{L}\p{N}]+/gu) || ["OS"];
    const initials = words.slice(0, 3).map((word) => [...word][0]).join("").toUpperCase();
    const safeLabel = escapeXml(label);
    const safeInitials = escapeXml(initials);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><defs><linearGradient id="b" x2="1" y2="1"><stop stop-color="#111511"/><stop offset=".52" stop-color="#1b2218"/><stop offset="1" stop-color="#090a09"/></linearGradient><radialGradient id="g" cx=".78" cy=".2" r=".7"><stop stop-color="#b7c77a" stop-opacity=".32"/><stop offset="1" stop-color="#b7c77a" stop-opacity="0"/></radialGradient></defs><rect width="640" height="360" rx="32" fill="url(#b)"/><rect width="640" height="360" rx="32" fill="url(#g)"/><g opacity=".18" stroke="#8d9b5b"><path d="M0 70h640M0 140h640M0 210h640M0 280h640M80 0v360M160 0v360M240 0v360M320 0v360M400 0v360M480 0v360M560 0v360"/></g><rect x="54" y="54" width="122" height="122" rx="28" fill="#8d9b5b"/><text x="115" y="135" text-anchor="middle" font-family="Arial,sans-serif" font-size="52" font-weight="700" fill="#090a09">${safeInitials}</text><text x="54" y="260" font-family="Arial,sans-serif" font-size="38" font-weight="700" fill="#f3f4ef">${safeLabel}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  logoImages.forEach((image) => {
    image.addEventListener("error", () => {
      image.setAttribute("src", createFallbackLogo(image));
      image.classList.add("using-logo-fallback");
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
