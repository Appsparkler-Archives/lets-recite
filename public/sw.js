self.addEventListener("install", () => {
  console.log("service worker installed");
});

self.addEventListener("activate", () => {
  console.log("service worker activated...");
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  console.log("fetching.", event.request.url);
  event.respondWith(event.request);
});
