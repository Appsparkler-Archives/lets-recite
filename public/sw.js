self.importScripts("../node_modules/idb/build/umd.js");

const CACHE_STATIC_NAME = "static-v3";
const CACHE_DYNAMIC_NAME = "dynamic-v3";

self.addEventListener("install", handleInstall);
self.addEventListener("activate", handleActivate);
self.addEventListener("fetch", handleFetch);

function handleActivate(event) {
  event.waitUntil(self.clients.claim());
  event.waitUntil(clearUnusedCaches());
}

function clearUnusedCaches() {
  return caches.keys().then((keys) => {
    return Promise.all(
      keys
        .filter(
          (key) => key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME
        )
        .map((key) => caches.delete(key))
    );
  });
}

function handleFetch(event) {
  //   event.respondWith(fetchFromCacheWithNetworkFallback(event));
  //   event.respondWith(fetchFromCache(event));
  event.respondWith(fetchFromNetwork(event));
}

// function fetchFromCacheWithNetworkFallback(event) {
//   return caches.match(event.request).then((response) => {
//     if (response) {
//       return response;
//     }
//   });
// }

function fetchFromNetwork(event) {
  return fetch(event.request)
    .then((response) => {
      cacheTheResponse(event, response);
      return response.clone();
    })
    .catch(() => {
      return caches.match(event.request);
    });
}

function cacheTheResponse(event, response) {
  return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
    cache.put(event.request.url, response.clone());
    return response;
  });
}

// function fetchFromCache(event) {
//   return caches.match(event.request).then((response) => response);
// }

// function fetchFromCacheWithNetworkFallback(event) {
//   return caches.match(event.request).then((response) => {
//     if (response) {
//       return response;
//     } else {
//       return fetch(event.request).then((response) => {
//         return caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
//           cache.put(event.request.url, response.clone());
//           return response;
//         });
//       });
//     }
//   });
// }

function handleInstall(event) {
  event.waitUntil(cacheAllStaticAssets());
}

function cacheAllStaticAssets() {
  const STATIC_ASSETS = ["/", "/vite.svg"];
  return caches.open(CACHE_STATIC_NAME).then((cache) => {
    return cache.addAll(STATIC_ASSETS);
  });
}
