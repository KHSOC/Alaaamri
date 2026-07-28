
"use strict";
const CACHE_NAME = "khalid-tech-hub-v18";
const CORE_ASSETS = [
  "/", "/index.html", "/en.html", "/ar.html",
  "/projects-en.html", "/projects-ar.html",
  "/tech-hub-en.html", "/tech-hub-ar.html", "/command-center-en.html", "/command-center-ar.html", "/windows-cleanup-en.html", "/windows-cleanup-ar.html", "/operating-systems-en.html", "/operating-systems-ar.html",
  "/404.html", "/style.css?v=18", "/app.js?v=18", "/commands.js?v=18", "/cleanup.js?v=18", "/systems.js?v=18",
  "/favicon-olive.svg?v=7", "/manifest.webmanifest", "/social-preview.png?v=14"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const networkFirst =
    event.request.mode === "navigate" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js");

  if (networkFirst) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") return response;
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/404.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
