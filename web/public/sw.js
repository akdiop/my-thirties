// Mise en cache de l'application elle-même (pages, scripts, styles, icônes) pour qu'elle s'ouvre sans réseau.
// Les données personnelles (Supabase) ne passent jamais par ce cache.
const CACHE = 'mt-shell-v2';
self.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/manifest.webmanifest', '/icon-192.png', '/apple-touch-icon.png'])).catch(() => undefined)); self.skipWaiting(); });
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Supabase, polices, vidéos : jamais en cache ici
  if (req.mode === 'navigate') {
    // Page : le réseau d'abord (toujours la dernière version), la copie si hors connexion.
    event.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('/', copy)); return res; }).catch(() => caches.match('/')));
    return;
  }
  if (url.pathname.startsWith('/assets/') || /\.(png|svg|webp|woff2?|webmanifest)$/.test(url.pathname)) {
    // Fichiers versionnés : la copie d'abord, puis le réseau.
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })));
  }
});

// Rappels envoyés par la fonction push-reminders (titre, texte et écran à ouvrir seulement).
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data ? event.data.text() : '' }; }
  event.waitUntil(self.registration.showNotification(data.title || 'My Thirties', {
    body: data.body || '', icon: '/icon-192.png', badge: '/icon-192.png', tag: data.tag || undefined, data: { url: data.url || '/' },
  }));
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || '/', self.location.origin).href;
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    const open = list.find((c) => c.url.startsWith(self.location.origin));
    if (open) { open.focus(); return open.navigate(url); }
    return self.clients.openWindow(url);
  }));
});
