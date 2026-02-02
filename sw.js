// This will trigger the service worker to update.
const CACHE_NAME = 'flowtudy-cache-v1.2';

// A list of all the essential files your app needs to work offline.
const FILES_TO_CACHE = [
    // HTML files for all languages
    '/',
    '/index.html',
    '/es/',
    '/es/index.html',
    '/pt/',
    '/pt/index.html',

    // Core app files
    '/style.css',
    '/script.js',
    '/manifest.webmanifest',

    // Essential assets
    '/assets/favicon.svg',
    '/assets/notification-sound.mp3',
    '/assets/ios-share-icon.svg',
    '/assets/android-more-icon.svg',

    // App icons
    '/assets/icons/icon-16x16.png',
    '/assets/icons/icon-32x32.png',
    '/assets/icons/icon-180x180.png',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png'
    // Note: .ico files are often not needed for modern PWAs, so it's excluded for simplicity.
];

// The 'install' event is fired when the service worker is first installed.
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    // We wait until the cache is opened and all our essential files are added to it.
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Caching app shell files');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    // Forces the waiting service worker to become the active service worker.
    self.skipWaiting();
});

// The 'activate' event is fired when the service worker is activated.
// This is a good place to clean up old caches.
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                // If a cache's name is not our current CACHE_NAME, we delete it.
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // Becomes the active service worker for all clients immediately.
    return self.clients.claim();
});

// The 'fetch' event is fired for every network request the page makes.
// We are using a "Cache First" strategy.
self.addEventListener('fetch', (event) => {
    // We only want to handle GET requests.
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // If the file is found in the cache, return it.
            // Otherwise, make a network request to fetch it.
            return response || fetch(event.request);
        })
    );
});