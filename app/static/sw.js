/* AI Life OS · PWA 壳缓存 service worker
   目的：加速二次打开（壳资源离线可用）；API 永不缓存（数据实时、隐私）。
   降级：注册失败（自签证书等场景被浏览器拒绝）由 app.js 静默容忍，不影响使用。 */
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
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u)))) // 单个失败不阻塞安装
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
  if (url.pathname.startsWith('/api/')) return; // API 不缓存

  // 页面导航：网络优先（登录态/最新壳），失败回退缓存（离线可开）
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
        .catch(() => caches.match('/').then((m) => m || new Response('离线', {
          status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })))
    );
    return;
  }

  // 壳静态资源：缓存优先 + 后台更新（二次打开秒开）
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
