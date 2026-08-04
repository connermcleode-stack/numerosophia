const CACHE_NAME = 'numerosophia-cache-v2';

// Elenco esatto di TUTTI i file e cartelle del tuo progetto
const FILES_TO_CACHE = [
  './',
  './index.html',
  './caldea.html',
  './pitagora.html',
  './archivio.html',
  './compatibilita.html',
  './condividi-compatibilita.html',
  './relazioni-karmiche.html',
  './style.css',
  './app.js',
  './calcoli.js',
  './db.js',
  './manifest.json',
  './icona-numerosophia.png'
];

// 1. Installazione e salvataggio in Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Salvataggio risorse in cache per offline...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Attivazione e pulizia vecchie cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Rimoziomne vecchia cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Intercettazione richieste: serve prima dalla cache, poi da rete
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});