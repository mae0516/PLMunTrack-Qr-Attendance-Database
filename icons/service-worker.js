
const CACHE_NAME = "plmuntrack-scanner-v1";

const APP_FILES = [
  "/scanner.html",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith("plmuntrack-scanner-") &&
                         key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // Do not cache attendance API requests or other external services.
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Use the network first for the scanner page.
  if (url.pathname === "/scanner.html" || url.pathname === "/") {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache =>
              cache.put("/scanner.html", copy)
            );
          }
          return response;
        })
        .catch(async () => {
          return (await caches.match("/scanner.html")) ||
                 (await caches.match(request));
        })
    );
  }
});
