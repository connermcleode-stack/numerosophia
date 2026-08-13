const CACHE_NAME = 'numerosophia-cache-v4';

// Elenco completo di file dell'app + tutte le 27 carte
const FILES_TO_CACHE = [
  './',
  './index.html',
  './caldea.html',
  './pitagora.html',
  './testi_pitagora.html',
  './archivio.html',
  './compatibilita.html',
  './condividi-compatibilita.html',
  './relazioni-karmiche.html',
  './lignaggio-familiare.html',
  './style.css',
  './app.js',
  './calcoli.js',
  './db.js',
  './manifest.json',
  './icona-numerosophia.png',

  // --- CARTE BASE & MAESTRE ---
  './carte/0.png',
  './carte/1.png',
  './carte/2.png',
  './carte/3.png',
  './carte/4.png',
  './carte/5.png',
  './carte/6.png',
  './carte/7.png',
  './carte/8.png',
  './carte/9.png',
  './carte/11.png',
  './carte/13.png',
  './carte/14.png',
  './carte/16.png',
  './carte/19.png',
  './carte/22.png',
  './carte/33.png',
  './carte/44.png',

  // --- CARTE OMBRA ---
  './carte/ombra1.png',
  './carte/ombra2.png',
  './carte/ombra3.png',
  './carte/ombra4.png',
  './carte/ombra5.png',
  './carte/ombra6.png',
  './carte/ombra7.png',
  './carte/ombra8.png',
  './carte/ombra9.png'
];

// 1. Installazione e salvataggio in Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Salvataggio risorse e carte in cache per offline...');
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
            console.log('Rimozione vecchia cache:', key);
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