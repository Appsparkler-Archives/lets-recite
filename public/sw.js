const CACHE_STATIC_NAME = "static-v3";
const CACHE_DYNAMIC_NAME = "dynamic-v3";

self.addEventListener("install", handleInstall);
self.addEventListener("activate", handleActivate);
self.addEventListener("fetch", handleFetch);
self.addEventListener("push", handlePush)
self.addEventListener("notificationclick", handleNotificationClick)
self.addEventListener("notificationclose", handleNotificationClose)

function handleNotificationClose(event) {
  console.log("Notification was closed", event)
}

function handleNotificationClick(event) {
  const notification = event.notificiation
  const action = event.action
  
  console.log(notification)

  if (action === "confirm") {
    console.log("Confirm was chosen")
    notification.close()
  } else {
    event.waitUntil(openTheURL(event))
  }
}

function openTheURL(event) {
  return clients.matchAll().then(($clients) => {
    const client = $clients.find(
      (client) => client.visibilityState === "visible"
    );
    if (client !== undefined) {
      client.navigate("/");
      client.focus();
    } else {
      clients.openWindow("/");
    }
    event.notification.close()
  });
}

function handlePush(event) {
  if (event.isTrusted && event.data) {
    const data = JSON.parse(event.data.text())
    var options = {
      body: data.content,
      data: {
        url: data.openUrl
      }
    }
    console.log(data.title, options)
    event.waitUntil(self.registration.showNotification(
      data.title, options
    ));
  }
  
  console.log("Push notification received", event)
}

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


