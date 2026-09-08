/* Kindred Studio service worker.
   The whole app is static and client-side, so precaching the shell is enough to
   make it work with no signal at all. */
const VERSION = 'kindred-v3';
const SHELL = [
  './', './index.html', './styles.css', './app.js',
  './manifest.webmanifest', './icon.svg',
  './icon-192.png', './icon-512.png', './icon-180.png', './icon-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    /* One miss must not fail the whole install, so each asset is added on its own. */
    await Promise.all(SHELL.map((url) => cache.add(url).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  let url;
  try { url = new URL(request.url); } catch { return; }
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(request, {ignoreSearch: true});
    const fromNetwork = fetch(request).then((response) => {
      if (response && response.ok && response.type === 'basic') cache.put(request, response.clone());
      return response;
    }).catch(() => null);

    /* Navigations go to the network first so a redeploy lands promptly; assets
       come from the cache first so the app opens instantly and works offline. */
    if (request.mode === 'navigate') {
      return (await fromNetwork) || cached || (await cache.match('./index.html')) || Response.error();
    }
    return cached || (await fromNetwork) || Response.error();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
