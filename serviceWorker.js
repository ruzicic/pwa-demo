// Service Worker Lifecycle: Install -> Activate -> Fetch -> [repeat]

const version = '1';
const staticCacheName = `${version}-static`;
const pagesCacheName = `${version}-pages`;
const imagesCacheName = `${version}-images`;

const criticalResources = [
    'http://localhost:3017/manifest.json',
    'http://localhost:3017/offline.html',
    '/css/styles.css',

    '/images/push-off.png',
    '/images/push-on.png',
    '/images/pwa.png',

    'favicon.ico',
    '/images/icons/apple-touch-icon.png',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-512x512.png',

    '/js/main.js',
    '/js/offline.js',
    '/js/toast.js'
];

const otherResources = [];

const updateStaticCache = () => {
    return caches.open(staticCacheName)
        .then(cache => {
            cache.addAll(otherResources);
            return cache.addAll(criticalResources);
        })
}

const stashInCache = (cacheName, request, response) => {
    caches.open(cacheName)
        .then(cache => cache.put(request, response));
}

// Limit the number of items in a specified cache
const trimCache = (cacheName, maxItems) => {
    caches.open(cacheName)
        .then(cache => {
            cache.keys()
                .then(keys => {
                    if (keys.length > maxItems)
                        cache.delete(keys[0])
                            .then(trimCache(cacheName, maxItems));
                });
        });
}

// Remove caches whose name is no longer valid
const clearOldCaches = () => {
    return caches.keys()
        .then(keys => {
            return Promise.all(
                keys.filter(key => key.indexOf(version) !== 0)
                    .map(key => caches.delete(key)));
        });
}

/**  
 *  INSTALL event
 *  fired only once in worker’s lifecycle
 *  responsible for installing the service worker and initially 
 *  caching the most important pages and assets of a website
 */
self.addEventListener('install', event => {
    console.info(`Event: install`);
    event.waitUntil(updateStaticCache()
        .then(() => self.skipWaiting()));
});

/**  
 *  ACTIVATE event
 *  fired only once in a lifecycle after the install event and 
 *  we will use it for deleting the old documents and files from cache
 */
self.addEventListener('activate', event => {
    console.info(`Event: activate`);
    event.waitUntil(clearOldCaches()
        .then(() => self.clients.claim()));
});

/**  
 *  FETCH event
 *  intercept HTTP requests and return relatively anything you want
 */
self.addEventListener('fetch', event => {
    console.log(`Event: fetch`);

    event.respondWith(
        // check if the resource was cached before
        caches.match(event.request)
            .then(response => {
                // serve the resource if cached, otherwise fetch it through the network
                return response || fetch(event.request)
                    .then(response => {
                        let copy = response.clone();
                        let request = event.request;
                        let url = new URL(request.url);

                        if (criticalResources.includes(url.pathname) || criticalResources.includes(url.pathname + '/')) {
                            stashInCache(staticCacheName, request, copy);
                        } else {
                            if (request.headers.get('Accept').startsWith('image')) { // is image
                                stashInCache(imagesCacheName, request, copy);
                            }
                            else { // is page
                                stashInCache(pagesCacheName, request, copy);
                            }
                        }

                        return response;
                    })
                    .catch(() => {
                        // serve "offline" page if it couldn't be fetched from network
                        return caches.match('offline.html');
                    });
            })
    );
});

self.addEventListener('message', event => {
    if (event.data.command == 'trimCaches') {
        console.info('Message received: trimCaches');
        trimCache(pagesCacheName, 50);
        trimCache(imagesCacheName, 20);
    }
});