// Advanced Service Worker for Portfolio Website
const CACHE_NAME = 'kalvin-portfolio-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/css/style.css',
  '/css/premium-enhancements.css',  '/css/ultra-premium-enhancements.css',
  '/css/responsive-premium.css',
  '/css/safari-compatibility.css',
  '/js/script.js',
  '/js/animations.js',
  '/js/effects.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Dynamic content patterns
const DYNAMIC_PATTERNS = [
  /^https:\/\/api\.github\.com/,
  /^https:\/\/avatars\.githubusercontent\.com/,
  /^https:\/\/opengraph\.githubassets\.com/,
  /^https:\/\/github-readme-stats\.vercel\.app/
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(name => {
            return name !== STATIC_CACHE && name !== DYNAMIC_CACHE;
          }).map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    // Static assets - cache first
    event.respondWith(cacheFirst(request));
  } else if (DYNAMIC_PATTERNS.some(pattern => pattern.test(request.url))) {
    // Dynamic content - network first with cache fallback
    event.respondWith(networkFirst(request));
  } else if (request.headers.get('accept')?.includes('text/html')) {
    // HTML pages - network first, fallback to offline page
    event.respondWith(handlePageRequest(request));
  } else {
    // Other assets - stale while revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Cache strategies
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function handlePageRequest(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return caches.match('/offline.html');
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Background sync for contact form
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  try {
    const formData = await getStoredFormData();
    if (formData) {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await clearStoredFormData();
        self.registration.showNotification('Message sent successfully!', {
          icon: '/assets/images/icon-192.png',
          badge: '/assets/images/icon-192.png'
        });
      }
    }
  } catch (error) {
    console.log('[SW] Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/assets/images/icon-192.png',
    badge: '/assets/images/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/assets/images/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/images/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Kalvin Shah Portfolio', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'));
  }
});

// Helper functions for storage
async function getStoredFormData() {
  return new Promise((resolve) => {
    // Implementation would depend on IndexedDB setup
    resolve(null);
  });
}

async function clearStoredFormData() {
  return new Promise((resolve) => {
    // Implementation would depend on IndexedDB setup
    resolve();
  });
}

// Periodic background sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'portfolio-update') {
    event.waitUntil(updatePortfolioData());
  }
});

async function updatePortfolioData() {
  try {
    // Update GitHub stats, project data, etc.
    const response = await fetch('https://api.github.com/users/Pusparaj99op');
    if (response.ok) {
      const data = await response.json();
      // Store updated data in cache
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put('github-profile', new Response(JSON.stringify(data)));
    }
  } catch (error) {
    console.log('[SW] Periodic sync failed:', error);
  }
}
