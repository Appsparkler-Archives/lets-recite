const STATIC_CACHE_KEY = "static-v1";
const DYNAMIC_CACHE_KEY = "dynamic-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_KEY).then((cache) => {
      cache.addAll([
        "/",
        "/vite.svg",
        "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ]);
    })
  );
  console.log("service worker installed...");
});

self.addEventListener("activate", (event) => {
  console.log("service worker activated...");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  console.log("fetching.", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("found in cache", event.request.url);
        return response;
      } else {
        console.log("fetching from remote", event.request.url);
        return fetch(event.request).then((response) => {
          return caches
            .open(DYNAMIC_CACHE_KEY)
            .then((cache) => {
              cache.put(event.request.url, response.clone());
              return response;
            })
            .catch(() => {});
        });
      }
    })
  );
  // event.respondWith(event.request);
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     if (response) {
  //       return response;
  //     }
  //     return fetch(event.request).then((response) => {
  //       return caches
  //         .open("dynamic")
  //         .then((cache) => {
  //           cache.put(event.request.url, response.clone());
  //           return response;
  //         })
  //         .catch(() => {});
  //     });
  //   })
  // );
});
