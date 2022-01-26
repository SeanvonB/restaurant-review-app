// restaurant_info.js

// This file constructs the map and info elements for specific restaurants,
// while main.js does the same for the home page.

// Globals
const newMap;
let restaurant;

// Initialize Leaflet map
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map("map", {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        attributionControl: false,
        scrollWheelZoom: false
      });
      L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}", {
        mapboxToken: "pk.eyJ1Ijoic2VhbnZvbmIiLCJhIjoiY2p1bm0wdnZjMDJ1NjN5cnZidWJxdzBvbSJ9.52AlhHseM7nwsY0k7yVz2g",
        maxZoom: 18,
        attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, " +
          "<a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, " +
          "Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
        id: "mapbox.streets"
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  
 
// Initialize Google map
// window.initMap = () => {
//   fetchRestaurantFromURL((error, restaurant) => {
//     if (error) { // Got an error!
//       console.error(error);
//     } else {
//       self.map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 16,
//         center: restaurant.latlng,
//         scrollwheel: false
//       });
//       fillBreadcrumb();
//       DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
//     }
//   });
// }

// Create individual review items
createReviewHTML = (review) => {
  const li = document.createElement("li");
  const name = document.createElement("p");
  name.textContent = review.name;
  li.appendChild(name);

  const date = document.createElement("p");
  date.textContent = review.date;
  li.appendChild(date);

  const rating = document.createElement("p");
  rating.textContent = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement("p");
  comments.textContent = review.comments;
  li.appendChild(comments);

  return li;
}

// Get current restaurant from page URL
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) {
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName("id");
  if (!id) {
    error = "No restaurant ID in URL"
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/// Add restaurant name to breadcrumb navigation
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById("breadcrumb");
  const li = document.createElement("li");
  li.textContent = restaurant.name;
  breadcrumb.appendChild(li);
}

// Add restaurant info to page
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const address = document.getElementById("restaurant-address");
  const cuisine = document.getElementById("restaurant-cuisine");
  const image = document.getElementById("restaurant-img");
  const name = document.getElementById("restaurant-name");


  address.textContent = restaurant.address;
  cuisine.textContent = restaurant.cuisine_type;
  image.alt = `${restaurant.name}, ${restaurant.neighborhood}`;
  image.className = "restaurant-img";
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  name.textContent = restaurant.name;

  // Fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // Fill reviews
  fillReviewsHTML();
}

// Add table of operating hours to restaurant info
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById("restaurant-hours");
  for (let key in operatingHours) {
    const row = document.createElement("tr");

    const day = document.createElement("td");
    day.textContent = key;
    row.appendChild(day);

    const time = document.createElement("td");
    time.textContent = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

// Add all reviews to restaurant info
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById("reviews-container");
  const title = document.createElement("h3");
  title.textContent = "Reviews";
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement("p");
    noReviews.textContent = "No Reviews Yet";
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById("reviews-list");
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

// Get parameter by name from page URL
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]${name}(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// AddEventListeners
document.addEventListener("DOMContentLoaded", (event) => {  
  initMap();

  // Register service worker
  // if ("serviceWorker" in navigator) {
  //   navigator.serviceWorker
  //     .register("/sw.js")
  //     .catch(function(error){
  //       console.error(error);
  //     });
  // }
});
