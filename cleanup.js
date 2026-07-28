"use strict";

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-cleanup-copy]");
    if (!button) return;

    const original = button.dataset.copyDefault || button.textContent;
    const success = button.dataset.copySuccess || "Copied";
    const copied = window.khalidCopyText
      ? await window.khalidCopyText(button.dataset.cleanupCopy || "")
      : false;

    button.textContent = copied
      ? success
      : (document.documentElement.lang === "ar" ? "تعذر النسخ" : "Copy failed");

    window.setTimeout(() => {
      button.textContent = original;
    }, 1500);
  });
});
