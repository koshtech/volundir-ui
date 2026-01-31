const CACHE_NAME = 'v1';

const caching_files = [
  '/',
  '/manifest.json',
  '/index.html',
  '/favicon.ico',
  '/lib/volundir/config/boot.js',
  '/app.js',
  '/icon512_maskable.png',
  '/icon512_rounded.png',
  '/icon256.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(caching_files)
    )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(e.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || e.request.method !== 'GET') {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });

          return networkResponse;
        })
        .catch((err) => {
          console.error(' [sw] Fetch failed:', e.request.url, err);
          throw err;
        });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );

  self.clients.claim();
});
