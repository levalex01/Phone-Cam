self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("coinscam-v1").then(cache => {
      return cache.addAll([
        "/",
        "/phone.html",
        "/viewer.html",
        "/styles.css",
        "/script-phone.js",
        "/script-viewer.js",
        "/manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
