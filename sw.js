const CACHE_NAME = "contractor-expenses-v38";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./styles-menu-v1.css", "./app-menu-v1.js", "./styles-menu-v2.css", "./app-menu-v2.js", "./styles-menu-v3.css", "./styles-menu-v4.css", "./styles-menu-v5.css", "./styles-menu-v6.css", "./styles-menu-v7.css", "./styles-menu-v8.css", "./app-menu-v7.js", "./app-menu-v6.js", "./app-menu-v3.js", "./app-menu-v4.js", "./app-menu-v5.js", "./manifest.webmanifest", "./app-icon.svg", "./construction-background.svg"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});
