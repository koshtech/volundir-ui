self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('pwa-cache-v1').then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
        '/offline.html',
        '/css/style.css',
        '/app/main.js'
      ])
    )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request).then(res => res || caches.match('/offline.html')))
  );
});