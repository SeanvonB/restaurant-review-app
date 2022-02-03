// sw.js

// This file builds a simple service worker to cache resources.

// List of files to be cached
const cacheThese = [
	"./css/styles.css",
	"./data/restaurants.json",
	"./img/1.webp",
	"./img/2.webp",
	"./img/3.webp",
	"./img/4.webp",
	"./img/5.webp",
	"./img/6.webp",
	"./img/7.webp",
	"./img/8.webp",
	"./img/9.webp",
	"./img/10.webp",
	"./img/banner-texture.png",
	"./img/favicon-1.ico",
	"./img/favicon-2.ico",
	"./img/favicon-3.ico",
	"./img/favicon-4.ico",
	"./img/favicon-5.ico",
	"./img/favicon-6.ico",
	"./img/favicon-7.ico",
	"./img/favicon-8.ico",
	"./img/favicon-9.ico",
	"./index.html",
	"./js/dbhelper.js",
	"./js/main.js",
	"./js/restaurant_info.js",
	"./restaurant.html",
];

// When installed, create or update cache
self.addEventListener("install", function (event) {
	event.waitUntil(
		caches.open("restaurant-reviews-1.0").then(function (cache) {
			return cache.addAll(cacheThese);
		})
	);
});

// Then, intercept and handle fetch requests
self.addEventListener("fetch", function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			// If found, return it from cache
			if (response) {
				return response;
			}

			// Else, release fetch request and cache response
			else {
				return fetch(event.request).then(function (response) {
					if (
						!response ||
						response.status !== 200 ||
						response.type !== "basic"
					) {
						return response;
					} else {
						let responseClone = response.clone();

						caches
							.open("restaurant-reviews-1.0")
							.then(function (cache) {
								cache.put(event.request, responseClone);
							});
						return response;
					}
				});
			}
		})
	);
});
