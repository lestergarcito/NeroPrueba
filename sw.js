const CACHE_NAME = "nero-studio-v2";
const APP_FILES = [
  "./", "./index.html", "./styles.css", "./app.js", "./manifest.json",
  "./assets/nero-icon-512.png",
  "./assets/product-1.jpg", "./assets/product-2.jpg", "./assets/product-3.jpg", "./assets/product-4.jpg",
  "./assets/product-5.jpg", "./assets/product-6.jpg", "./assets/product-7.jpg", "./assets/product-8.jpg"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) return cached;
    return fetch(event.request).then(response => {
      if (response.ok && new URL(event.request.url).origin === self.location.origin) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => caches.match("./index.html"));
  }));
});
