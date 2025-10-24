// Service Worker for Anthony's Weather App
const CACHE_NAME = 'anthonys-weather-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event — cache core assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing and caching app shell...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.error('[Service Worker] Caching failed:', err))
  );
});

// Fetch event — respond with cache, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Serve cached file if available
      if (response) {
        console.log('[Service Worker] Serving from cache:', event.request.url);
        return response;
      }
      // Otherwise, fetch from network
      console.log('[Service Worker] Fetching from network:', event.request.url);
      return fetch(event.request)
        .then((networkResponse) => {
          // Optionally: cache new responses for offline use
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return networkResponse;
        })
        .catch((error) => {
          console.error('[Service Worker] Fetch failed; returning offline page:', error);
        });
    })
  );
});

// Activate event — clear old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating new service worker...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});