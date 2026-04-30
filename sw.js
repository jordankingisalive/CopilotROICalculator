const CACHE_NAME = 'copilot-roi-v12';
const ASSETS = [
    './',
    './index.html',
    './roi-calculator.html',
    './Start Here.html',
    './styles.css',
    './script.js',
    './sales-script.js',
    './sample-data.csv',
    './lib/jspdf.umd.min.js',
    './lib/html2canvas.min.js',
    './lib/docx.umd.js',
    './lib/pptxgen.bundle.js'
];

// Install: pre-cache every asset
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
    );
});

// Activate: remove old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// Fetch: cache-first, never hit network if cached
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
});
