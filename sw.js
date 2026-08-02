"use strict";

const CACHE_NAME = "khalid-tech-hub-v36";
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/en.html",
  "/ar.html",
  "/projects-en.html",
  "/projects-ar.html",
  "/tech-hub-en.html",
  "/tech-hub-ar.html",
  "/command-center-en.html",
  "/command-center-ar.html",
  "/windows-cleanup-en.html",
  "/windows-cleanup-ar.html",
  "/operating-systems-en.html",
  "/operating-systems-ar.html",
  "/websec/",
  "/websec/index.html",
  "/websec/websec.css?v=35",
  "/websec/websec-data.js?v=35",
  "/websec/websec.js?v=35",
  "/security-lab/",
  "/security-lab/index.html",
  "/security-lab/security-lab.css?v=35",
  "/security-lab/security-lab.js?v=35",
  "/courses",
  "/courses.css?v=36",
  "/courses-data.js?v=36",
  "/ccoa-data.js?v=36",
  "/course-guides.js?v=36",
  "/course-advanced.js?v=36",
  "/course-quizzes.js?v=36",
  "/courses.js?v=36",
  "/offline.html",
  "/search-index.js?v=32",
  "/toolbox.js?v=29",
  "/toolbox-ar.html",
  "/toolbox-en.html",
  "/style.css?v=32",
  "/app.js?v=26",
  "/commands-data.js?v=26",
  "/commands.js?v=26",
  "/cleanup.js?v=26",
  "/systems.js?v=28",
  "/favicon-olive.svg?v=26",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/manifest.webmanifest",
  "/social-preview.png?v=26"
];

const cacheResponse = async (request, response) => {
  if (!response || !response.ok || response.type === "opaque") return response;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
};

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(CORE_ASSETS.map((asset) => cache.add(asset)))
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));

    if ("navigationPreload" in self.registration) {
      await self.registration.navigationPreload.enable();
    }

    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse;
        if (preload) return cacheResponse(request, preload);

        const network = await fetch(request);
        return cacheResponse(request, network);
      } catch (_) {
        return (await caches.match(request))
          || (await caches.match("/offline.html"))
          || Response.error();
      }
    })());
    return;
  }

  const staticDestination = new Set(["style", "script", "worker", "image", "font", "manifest"]);
  if (staticDestination.has(request.destination)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) {
        event.waitUntil(
          fetch(request)
            .then((response) => cacheResponse(request, response))
            .catch(() => undefined)
        );
        return cached;
      }

      try {
        const network = await fetch(request);
        return cacheResponse(request, network);
      } catch (_) {
        return Response.error();
      }
    })());
  }
});
