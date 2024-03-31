self.addEventListener("install", (event) => {
  console.log("service worker installed");
  event.waitUntil(
    caches.open("static").then((cache) => {
      console.log("[Service Workder Precaching App Shell");
      cache.addAll(["/", "/index.html"]);
    })
  );
});

self.addEventListener("activate", () => {
  console.log("service worker activated...");
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  console.log("fetching.", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        return caches
          .open("dynamic")
          .then((cache) => {
            cache.put(event.request.url, response.clone());
            return response;
          })
          .catch(() => {});
      });
    })
  );
});
