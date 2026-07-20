const CACHE_NAME = 'numerosophia-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Installazione e salvataggio dei file in cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Gestione delle richieste offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
