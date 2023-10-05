self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('PWA-Cache').then((caches) => {
            console.log('Opened Cache')
            return caches.addAll([
                './assets/react.svg',
                '/vite.svg'
            ])
        })
    )
})

// Fetch event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                // Cache hit, return the response
                return response;
            }
            // Not found in cache, fetch from the network
            return fetch(event.request);
        })
    );
});