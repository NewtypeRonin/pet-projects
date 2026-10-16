const CACHE_NAME = 'kotoba-archive-v11';
const APP_SHELL = [
  './',
  './index.html',
  './style.css?v=11',
  './app.js?v=11',
  './manifest.json',
  './icon.svg',
  './EDRDG-LICENSE.html',
  './JSON/JLPT_vocab_ALL.json',
  './JSON/JLPT_kanji_ALL.json',
  './JSON/JLPT_vocab_enriched.json',
  './JSON/JLPT_kanji_details.json',
  './JSON/data_coverage.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => /^(jlpt-match-|jlpt-archive-|kotoba-archive-)/.test(key) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok || response.type === 'opaque') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return new Response('Offline and not cached.', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
