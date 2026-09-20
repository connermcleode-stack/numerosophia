const CACHE_NAME = 'numerosophia-cache-v5';

// Elenco esatto dei file presenti nella cartella di progetto
const FILES_TO_CACHE = [
  './',
  './index.html',
  './pitagora.html',
  './caldea.html',
  './archivio.html',
  './compatibilita.html',
  './condividi-compatibilita.html',
  './relazioni-karmiche.html',
  './lignaggio-familiare.html',
  './style.css',
  './app.js',
  './calcoli.js',
  './db.js',
  './testi_pitagora.js',
  './testi_influenze.js',
  './destino_anima.js',
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

// 1. Installazione sicura e tollerante
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Salvataggio risorse e carte in cache...');
      return Promise.allSettled(
        FILES_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Impossibile aggiungere alla cache: ${url}`, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});