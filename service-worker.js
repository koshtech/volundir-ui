const CACHE_NAME = 'v1';

console.log(' [sw] Starting...');

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/lib/volundir/config/boot.js',
        '/app.js'
      ])
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
