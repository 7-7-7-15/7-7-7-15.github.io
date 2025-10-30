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
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
  '/EclipseGames.html',
    '/Tv.json',
  '/Movies.json',
    '/games.json',
     '/sw.js',
   '/Spelunky',
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
