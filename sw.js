const CACHE_NAME = 'numerosophia-v3';

// Elenco esatto di tutti i file della tua cartella di progetto
const ASSETS = [
  './',
  './index.html',
  './pitagora.html',
  './archivio.html',
  './caldea.html',
  './compatibilita.html',
  './condividi-compatibilita.html',
  './manifest.json',
  './style.css',
  
  // File JavaScript
  './app.js',
  './calcoli.js',
  './db.js',
  
  // Icona
  './icona-numerosophia.png',

  // Immagini e Ombre dentro la sottocartella carte/
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

// Installazione: forza il salvataggio immediato in cache di tutti gli elementi
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Attivazione: cancella automaticamente le vecchie cache precedenti
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercettazione delle richieste: risponde SEMPRE prima dalla cache locale
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});