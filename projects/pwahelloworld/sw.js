var cacheName = 'PawHello';
var dir = self.location.href.substr(0,self.location.href.lastIndexOf('/'))
var filesToCache = [dir + "/",
                    dir + "/index.html",
                    dir + "/css/style.css",
                    dir + "/js/main.js"];

console.log(dir);
console.log(filesToCache);

// Start the service workers and cache the app's content
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

// Serve cached content when offline
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});