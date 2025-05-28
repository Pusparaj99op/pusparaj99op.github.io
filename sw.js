// Service Worker for Progressive Web App functionality

const CACHE_NAME = 'portfolio-v1';

// Files to cache for offline use
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/theme.css',
  '/css/style.css',
  '/css/effects.css',
  '/js/script.js',
  '/js/animations.js',
  '/js/mobile-optimizations.js',
  '/js/theme-switcher.js'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Delete old caches
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  // Ensure service worker takes control immediately
  self.clients.claim();
});

// Fetch event - network first with cache fallback strategy
self.addEventListener('fetch', event => {
  // Skip for non GET requests or browser extensions
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension') ||
      event.request.url.includes('extension')) {
    return;
  }

  // For page navigations, try the network, fall back to cache, then offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If no cache found, return the offline page
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // For assets, try network first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Clone the response before using it
        const clonedResponse = networkResponse.clone();
        
        // Update the cache with the fresh response
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clonedResponse);
        });
        
        return networkResponse;
      })
      .catch(() => {
        // If network fails, try to get it from cache
        return caches.match(event.request);
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
