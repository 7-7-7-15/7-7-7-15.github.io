// sw.js - Simple Service Worker
const CACHE_NAME = 'eclipse-cache-v1';

// Files to save for offline use
const FILES_TO_CACHE = [
  '/index.html',
  '/Launch/index.html',
  '/assets/logo/logo.png',
  '/assets/backgrounds/crimson.png',
  '/assets/backgrounds/cyber.png',
   '/assets/backgrounds/forest.png',
   '/assets/backgrounds/gray.png',
   '/assets/backgrounds/lavendar.png',
   '/assets/backgrounds/midnight.png',
   '/assets/backgrounds/neon.png',
   '/assets/backgrounds/ocean.png',
   '/assets/backgrounds/purplerain.png',
   '/assets/backgrounds/search.jpg',
   '/assets/backgrounds/sunset.png',
   '/assets/backgrounds/sunsetblue.png',
  // Add other important files here
];

// Install - save files for offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// Fetch - try cache first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
