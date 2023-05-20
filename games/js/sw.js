const CACHE_NAME = 'notepad-cache-v1';
const urlsToCache = ['./', './games.json', './js/main.js', './css/main.css', './css/fontawesome.css'];
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache)
    }))
});
self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then((response) => {
        if (response) {
            return response
        }
        let fetchRequest = event
            .request
            .clone();
        return fetch(fetchRequest).then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response
            }
            let responseToCache = response.clone();
            caches
                .open(CACHE_NAME)
                .then((cache) => {
                    cache.put(event.request, responseToCache)
                });
            return response
        })
    }))
});
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['notepad-cache-v1'];
    event.waitUntil(caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName)
            }
        }))
    }))
});
