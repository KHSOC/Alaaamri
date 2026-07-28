
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-cleanup-copy]");
    if (!button) return;

    const original = button.dataset.copyDefault || button.textContent;
    const success = button.dataset.copySuccess || "Copied";

    try {
      await navigator.clipboard.writeText(button.dataset.cleanupCopy || "");
      button.textContent = success;
    } catch (_) {
      button.textContent = document.documentElement.lang === "ar" ? "تعذر النسخ" : "Copy failed";
    }

    window.setTimeout(() => {
      button.textContent = original;
    }, 1500);
  });
});
