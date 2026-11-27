/* AI Life OS · PWA shell-caching service worker
   Purpose: faster repeat opens (shell assets work offline); the API is never cached (data is live and private).
   Degradation: registration failures (e.g. rejected by the browser with self-signed certs) are silently tolerated by app.js, without affecting use. */
const CACHE = 'lifeos-shell-v2';
const SHELL = [
  '/',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
  '/icons/icon-32.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u)))) // one failure doesn't block installation
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return; // never cache the API

  // Page navigation: network first (login state / latest shell), fall back to cache on failure (opens offline)
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && !res.redirected) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put('/', copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match('/').then((m) => m || new Response('Offline', {
          status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })))
    );
    return;
  }

  // Shell static assets: cache first + background update (repeat opens are instant)
  e.respondWith(
    caches.match(req).then((hit) => {
      const refresh = fetch(req).then((res) => {
        if (res.ok && !res.redirected) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);
      return hit || refresh;
    })
  );
});
