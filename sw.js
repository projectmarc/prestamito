const CACHE_NAME = 'prestamos-pwa-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/styles.css',
    './js/calculator.js',
    './js/app.js',
    './manifest.json'
];

// Instalar Service Worker y cachear recursos estáticos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Interceptar peticiones y servir desde el caché si no hay red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Devuelve el recurso del caché si se encuentra, sino hace fetch a la red
                return response || fetch(event.request);
            })
    );
});

// Activar el SW y limpiar cachés antiguos (útil para futuras actualizaciones)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});