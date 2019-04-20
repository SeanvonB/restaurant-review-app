// List of files to be cached
const cacheThese = [
    "./css/styles.css",
    "./data/restaurants.json",
    "./img/1.jpg",
    "./img/2.jpg",
    "./img/3.jpg",
    "./img/4.jpg",
    "./img/5.jpg",
    "./img/6.jpg",
    "./img/7.jpg",
    "./img/8.jpg",
    "./img/9.jpg",
    "./index.html",
    "./js/dbhelper.js",
    "./js/main.js",
    "./js/restaurant_info.js",
    "./restaurant.html"
];

// When installed, create or update cache
self.addEventListener("install", function(event) {
    event.waitUntil(
        caches
            .open("restaurant-reviews-1.0")
            .then(function(cache) {
                return cache.addAll(cacheThese);
            })
    );
});

// Then, intercept and handle fetch requests
self.addEventListener("fetch", function(event) {
    event.respondWith(

        // Check for requested URL in cache
        caches
            .match(event.request)
            .then(function(response) {

                // If found, return it from cache
                if (response) {
                    return response;
                }

                // Otherwise, release fetch request...
                else {
                    return fetch(event.request)

                    // ... and add its response to cache
                    .then(function(response) {
                        if (!response ||
                            response.status !== 200 ||
                            response.type !== "basic") {
                                return response;
                        } else {

                            let responseClone = response.clone();

                            caches
                                .open("restaurant-reviews-1.0")
                                .then(function(cache) {
                                    cache.put(
                                        event.request, 
                                        responseClone
                                    );
                                });
                            return response;
                        }
                    });
                }
            })
    );
});
