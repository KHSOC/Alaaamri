"use strict";

const CACHE_NAME = "khalid-tech-hub-v40";
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
  "/websec/websec.css?v=40",
  "/websec/websec-data-v39.js?v=40",
  "/websec/websec.js?v=40",
  "/security-lab/",
  "/security-lab/index.html",
  "/security-lab/security-lab.css?v=39",
  "/security-lab/security-lab-data-1.js?v=39",
  "/security-lab/security-lab-data-2.js?v=39",
  "/security-lab/security-lab-data-3.js?v=39",
  "/security-lab/security-lab.js?v=39",
  "/courses",
  "/courses.css?v=38",
  "/courses-data.js?v=38",
  "/ccoa-data.js?v=38",
  "/fortigate-data.js?v=38",
  "/course-guides.js?v=38",
  "/course-advanced.js?v=38",
  "/course-mastery.js?v=38",
  "/course-quizzes.js?v=38",
  "/courses.js?v=38",
  "/offline.html",
  "/search-index.js?v=32",
  "/toolbox.js?v=29",
  "/toolbox-ar.html",
  "/toolbox-en.html",
  "/style.css?v=37a",
  "/app.js?v=37b",
  "/commands-data.js?v=26",
  "/commands.js?v=26",
  "/cleanup.js?v=26",
  "/systems.js?v=28",
  "/favicon-olive.svg?v=40",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/manifest.webmanifest",
  "/social-preview.png?v=26"
];

const cacheResponse = async (request, response) => {
  if (
    !response ||
    !response.ok ||
    response.redirected ||
    response.type === "opaque"
  ) {
    return response;
  }

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
    await Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") return;

  const staticDestination = new Set([
    "style",
    "script",
    "worker",
    "image",
    "font",
    "manifest"
  ]);

  if (!staticDestination.has(request.destination)) return;

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
});
