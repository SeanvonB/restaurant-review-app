// dbhelper.js

// This object contains common database helper functions.

class DBHelper {
	// Construct URL for database
	// UPDATE THIS WITH THE SERVER LOCATION OF restaurants.json!
	static get DATABASE_URL() {
		return `./data/restaurants.json`;
	}

	// Fetch ALL cuisines
	static fetchCuisines(callback) {
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				const cuisines = restaurants.map(
					(v, i) => restaurants[i].cuisine_type
				);

				// Remove duplicates
				const uniqueCuisines = cuisines.filter(
					(v, i) => cuisines.indexOf(v) == i
				);
				callback(null, uniqueCuisines);
			}
		});
	}

	// Fetch ALL neighborhoods
	static fetchNeighborhoods(callback) {
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				const neighborhoods = restaurants.map(
					(v, i) => restaurants[i].neighborhood
				);

				// Remove duplicates
				const uniqueNeighborhoods = neighborhoods.filter(
					(v, i) => neighborhoods.indexOf(v) == i
				);
				callback(null, uniqueNeighborhoods);
			}
		});
	}

	// Fetch ALL restaurants
	static fetchRestaurants(callback) {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", DBHelper.DATABASE_URL);
		xhr.onload = () => {
			if (xhr.status === 200) {
				const json = JSON.parse(xhr.responseText);
				const restaurants = json.restaurants;
				callback(null, restaurants);
			} else {
				const error = `Request failed. Returned status of ${xhr.status}`;
				callback(error, null);
			}
		};
		xhr.send();
	}

	// Fetch specific restaurant
	static fetchRestaurantById(id, callback) {
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				const restaurant = restaurants.find((r) => r.id == id);
				if (restaurant) {
					callback(null, restaurant);
				} else {
					callback("Restaurant does not exist", null);
				}
			}
		});
	}

	// Fetch subset of restaurants by specific cuisine
	static fetchRestaurantByCuisine(cuisine, callback) {
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				const results = restaurants.filter(
					(r) => r.cuisine_type == cuisine
				);
				callback(null, results);
			}
		});
	}

	// Fetch subset of restaurants by specific neighborhood
	static fetchRestaurantByNeighborhood(neighborhood, callback) {
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				const results = restaurants.filter(
					(r) => r.neighborhood == neighborhood
				);
				callback(null, results);
			}
		});
	}

	// Fetch subset of restaurants by specific cuisine AND neighborhood
	static fetchRestaurantByCuisineAndNeighborhood(
		cuisine,
		neighborhood,
		callback
	) {
		// Fetch all restaurants
		DBHelper.fetchRestaurants((error, restaurants) => {
			if (error) {
				callback(error, null);
			} else {
				let results = restaurants;
				if (cuisine != "all") {
					results = results.filter((r) => r.cuisine_type == cuisine);
				}
				if (neighborhood != "all") {
					results = results.filter(
						(r) => r.neighborhood == neighborhood
					);
				}
				callback(null, results);
			}
		});
	}

	// Set Leaflet map marker for specific restaurant
	static mapMarkerForRestaurant(restaurant, map) {
		// https://leafletjs.com/reference-1.3.0.html#marker
		const marker = new L.marker(
			[restaurant.latlng.lat, restaurant.latlng.lng],
			{
				title: restaurant.name,
				alt: restaurant.name,
				url: DBHelper.urlForRestaurant(restaurant),
			}
		);
		marker.addTo(map);
		return marker;
	}

	// Set Google map marker for specific restaurant
	// static mapMarkerForRestaurant(restaurant, map) {
	// 	const marker = new google.maps.Marker({
	// 		position: restaurant.latlng,
	// 		title: restaurant.name,
	// 		url: DBHelper.urlForRestaurant(restaurant),
	// 		map: map,
	// 		animation: google.maps.Animation.DROP,
	// 	});
	// 	return marker;
	// }

	// Construct URL for restaurant page
	static urlForRestaurant(restaurant) {
		return `./restaurant.html?id=${restaurant.id}`;
	}

	// Construct URL for restaurant image
	static urlForRestaurantImage(restaurant) {
		return `./img/${restaurant.image}`;
	}
}
