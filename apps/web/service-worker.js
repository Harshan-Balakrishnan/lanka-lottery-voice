const CACHE_NAME = "lanka-lottery-voice-shell-v4";
const SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest", "../../file_0000000066788211955866ab83f3c897.png"];
const STATIC_URLS = new Set(SHELL.map((path) => new URL(path, self.location.href).href));

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys
        .filter((key) => key.startsWith("lanka-lottery-voice-shell-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin || !STATIC_URLS.has(requestUrl.href)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response.ok || response.type !== "basic") return response;
        const copy = response.clone();
        return caches.open(CACHE_NAME)
          .then((cache) => cache.put(event.request, copy))
          .then(() => response);
      });
    })
  );
});
