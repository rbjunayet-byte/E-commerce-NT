// ═══════════════════════════════════════════════════════════════
//  NovaTech BD — Service Worker
//  PWA: Offline Cache + Push Notifications + Background Sync
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME   = 'novatech-bd-v1.0.0';
const STATIC_CACHE = 'novatech-static-v1';
const DATA_CACHE   = 'novatech-data-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/auth.html',
  '/dashboard.html',
  '/products.html',
  '/cart.html',
  '/orders.html',
  '/manifest.json',
  '/styles/main.css',
  '/styles/components.css',
  '/utils/helpers.js',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Hind+Siliguri:wght@400;600;700&display=swap',
];

// ── Install ──────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => console.warn('[SW] Cache addAll error:', err));
    }).then(() => self.skipWaiting())
  );
});

// ── Activate ─────────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== DATA_CACHE)
          .map(k => { console.log('[SW] Deleting old cache:', k); return caches.delete(k); })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch Strategy ────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET and Firebase/Cloudinary requests
  if (request.method !== 'GET') return;
  if (url.hostname.includes('firebaseio.com') || url.hostname.includes('googleapis.com/identitytoolkit')) return;
  if (url.hostname.includes('cloudinary.com') && request.url.includes('/upload')) return;

  // Cache-First for static assets
  if (STATIC_ASSETS.some(a => request.url.endsWith(a)) || url.pathname.match(/\.(css|js|png|jpg|svg|ico|woff2?)$/)) {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then(c => c.put(request, clone));
          }
          return res;
        }).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // Network-First for API / dynamic data
  if (url.hostname.includes('firebaseio.com') || url.hostname.includes('googleapis.com')) {
    e.respondWith(
      fetch(request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(DATA_CACHE).then(c => c.put(request, clone));
        }
        return res;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Stale-While-Revalidate for HTML pages
  e.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(res => {
        if (res.ok) caches.open(STATIC_CACHE).then(c => c.put(request, res.clone()));
        return res;
      }).catch(() => null);
      return cached || fetchPromise || caches.match('/index.html');
    })
  );
});

// ── Push Notifications ────────────────────────────────
self.addEventListener('push', (e) => {
  let data = { title: 'NovaTech BD', body: 'You have a new notification!', icon: '/assets/icons/icon-192.png', badge: '/assets/icons/badge-72.png', url: '/' };
  try {
    if (e.data) data = { ...data, ...e.data.json() };
  } catch {}

  const options = {
    body:    data.body,
    icon:    data.icon,
    badge:   data.badge,
    image:   data.image,
    vibrate: [200, 100, 200],
    tag:     data.tag || 'novatech-notif',
    renotify: true,
    requireInteraction: !!data.requireInteraction,
    actions: data.actions || [
      { action: 'view',    title: 'View',    icon: '/assets/icons/icon-96.png' },
      { action: 'dismiss', title: 'Dismiss', icon: '/assets/icons/icon-96.png' },
    ],
    data: { url: data.url }
  };

  e.waitUntil(self.registration.showNotification(data.title, options));
});

// ── Notification Click ────────────────────────────────
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── Background Sync ───────────────────────────────────
self.addEventListener('sync', (e) => {
  if (e.tag === 'sync-orders') {
    e.waitUntil(syncPendingOrders());
  }
  if (e.tag === 'sync-cart') {
    e.waitUntil(syncCart());
  }
});

async function syncPendingOrders() {
  // Sync any offline orders when connection restores
  const clients_list = await clients.matchAll();
  clients_list.forEach(client => client.postMessage({ type: 'SYNC_ORDERS' }));
}

async function syncCart() {
  const clients_list = await clients.matchAll();
  clients_list.forEach(client => client.postMessage({ type: 'SYNC_CART' }));
}

// ── Message Handler ───────────────────────────────────
self.addEventListener('message', (e) => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data?.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }
});

console.log('[SW] NovaTech BD Service Worker v1.0.0 loaded');
