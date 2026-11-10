// Service worker: lets the game install as an app and work offline.
// Bump CACHE when you want every phone to drop its old copy.
const CACHE = "forehead-game-v7";
const ASSETS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-192.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
  "lists/celebrities.js",
  "lists/computer-science.js",
  "lists/french-culture.js",
  "lists/minecraft.js",
  "lists/movies.js",
  "lists/semiconductors.js",
  "lists/tv-series.js",
  "lists/video-games.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (so edits show up as soon as you're online), cache as the offline fallback.
// Any same-origin file fetched while online, including new lists/*.js, is cached automatically.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("index.html")))
  );
});
