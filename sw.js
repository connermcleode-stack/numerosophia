const CACHE_NAME = 'numerosophia-cache-v7';

// Utilizza percorsi relativi senza il punto iniziale per un matching perfetto delle chiavi
const FILES_TO_CACHE = [
  '/',
  'index.html',
  'pitagora.html',
  'caldea.html',
  'archivio.html',
  'compatibilita.html',
  'condividi-compatibilita.html',
  'relazioni-karmiche.html',
  'lignaggio-familiare.html',
  'style.css',
  'app.js',
  'calcoli.js',
  'db.js',
  'testi_pitagora.js',
  'testi_influenze.js',
  'destino_anima.js',
  'manifest.json',
  'icona-numerosophia.png',

  // --- CARTE BASE & MAESTRE ---
  'carte/0.png',
  'carte/1.png',
  'carte/2.png',
  'carte/3.png',
  'carte/4.png',
  'carte/5.png',
  'carte/6.png',
  'carte/7.png',
  'carte/8.png',
  'carte/9.png',
  'carte/11.png',
  'carte/13.png',
  'carte/14.png',
  'carte/16.png',
  'carte/19.png',
  'carte/22.png',
  'carte/33.png',
  'carte/44.png',

  // --- CARTE OMBRA ---
  'carte/ombra1.png',
  'carte/ombra2.png',
  'carte/ombra3.png',
  'carte/ombra4.png',
  'carte/ombra5.png',
  'carte/ombra6.png',
  'carte/ombra7.png',
  'carte/ombra8.png',
  'carte/ombra9.png'
];

// 1. Installazione sicura
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Salvataggio risorse e carte in cache per offline...');
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

// 2. Attivazione e pulizia vecchie cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Rimozione vecchia cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Intercettazione richieste con tolleranza per Font Google e Carte
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Salva in cache qualsiasi risorsa esterna/statica caricata con successo (compresi i font di Google)
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback per immagini delle carte mancanti in offline
          if (event.request.url.includes('/carte/')) {
            return caches.match('carte/ombra9.png') || caches.match('carte/0.png');
          }
          // Fallback per navigazione pagine se la rete fallisce
          if (event.request.mode === 'navigate') {
            return caches.match('pitagora.html') || caches.match('index.html');
          }
        });
    })
  );
});