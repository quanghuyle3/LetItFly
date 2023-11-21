import { Loader } from "@googlemaps/js-api-loader";

// Haversine formula
/**
 * @param {Object} start
 * @param {Object} end
 * start = {lat: latitude, lng: longitude}
 * end = {lat: latitude, lng: longitude}
 */
function getDistanceFromLatLngInKm(start, end) {
  const { lat: lat1, lng: lon1 } = start;
  const { lat: lat2, lng: lon2 } = end;

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

// wrap user location in a promise
const userLocation = new Promise((resolve, reject) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        resolve({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.log(error);
      },
      { enableHighAccuracy: true, maximumAge: 1, timeout: 15000 }
    );
  } else {
    reject(null);
  }
});

// reusable loader with api key
const googleApiLoader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_KEY,
});

/**
 * Given a destination string, return the lat and lng coords
 * @param {String} destinationString
 */
function geocode(destinationString, callbackFunction) {
  googleApiLoader.importLibrary("geocoding").then(({ Geocoder }) => {
    var geocoder = new Geocoder();
    geocoder.geocode({ address: destinationString }, callbackFunction);
  });
}

// Expectation: given an input element, return set of destination coords
function autocomplete(inputElement, callback) {
  // prioritize search results in these bounds
  const bayAreaBounds = {
    north: 37.96328887, //37.96328887243628
    south: 37.23556706, //37.235567063362325
    east: -121.61026004, //-121.61026004010768
    west: -122.66290189, //-122.6629018966861
  };

  // search options
  const options = {
    bounds: bayAreaBounds,
    componentRestrictions: { country: "us" },
    fields: ["geometry"],
    type: ["airport", "geocode", "street_address", "street_number"],
  };

  googleApiLoader.importLibrary("places").then(({ Autocomplete }) => {
    var autocomplete = new Autocomplete(inputElement, options);
    autocomplete.addListener("place_changed", callback);
  });
}

var directionsRenderer;
var directionsService;
/**
 * - currentLocation: {lat: latitude, lng: longitude}
 * - destinationLocation: {lat: latitude, lng: longitude}
 * - currentMap: promise function
 * - currentRoute: useRef hook
 * @param {Object} currentLocation
 * @param {Object} destinationLocation
 * @param {Promise} currentMap
 * @param {Object} currentRoute
 */
function getDirections(
  currentLocation,
  destinationLocation,
  currentMap,
  currentRoute,
  setDistance,
  setDuration,
  setCost
) {
  setDistance = setDistance || 0;
  setDuration = setDuration || 0;
  setCost = setCost || 0;
  googleApiLoader
    .importLibrary("routes")
    .then(({ DirectionsService, DirectionsRenderer }) => {
      if (!directionsService) {
        directionsService = new DirectionsService();
      }
      if (!directionsRenderer) {
        directionsRenderer = new DirectionsRenderer();
        currentMap.then((map) => {
          directionsRenderer.setMap(map);
        });
      }
      currentMap.then((map) => {
        if (directionsRenderer.getMap() !== map) directionsRenderer.setMap(map);
      });

      var request = {
        origin: currentLocation,
        destination: destinationLocation,
        travelMode: "DRIVING",
      };

      directionsService.route(request, (results, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(results);
        } else console.log("Directions Failed: ", status);
        if (currentRoute) {
          function calcCost(distance) {
            let cost = 15;
            const mile = 1609.34;
            distance = distance / mile; // convert meters to miles
            if (distance < 2) return cost.toFixed(2);
            distance = distance - 2; // first two miles are free
            if (distance <= 10) {
              cost += 0.25 * distance;
              return cost.toFixed(2);
            }
            cost += 0.25 * 5;
            cost += 1.1 * (distance - 5);
            return cost.toFixed(2);
          }
          currentRoute.current = {
            distance: results.routes[0].legs[0].distance.text,
            duration: results.routes[0].legs[0].duration.text,
            cost: calcCost(results.routes[0].legs[0].distance.value),
            startLat: results.routes[0].legs[0].start_location.lat(),
            startLng: results.routes[0].legs[0].start_location.lng(),
            endLat: results.routes[0].legs[0].end_location.lat(),
            endLng: results.routes[0].legs[0].end_location.lng(),
            path: results,
          };
        }
        if (setDistance) setDistance(currentRoute.current.distance);
        if (setDuration) setDuration(currentRoute.current.duration);
        if (setCost) setCost(currentRoute.current.cost);
      });
    });
}

function clearDirections() {
  if (directionsRenderer) directionsRenderer.set("directions", null);
}

function createMap(mapContainer, centerCoords, zoomLevel) {
  const mapOptions = {
    center: centerCoords,
    zoom: zoomLevel ? zoomLevel : 17,
    disableDefaultUI: true,
    clickableIcons: false,
  };

  return googleApiLoader.importLibrary("maps").then(({ Map }) => {
    var map = new Map(mapContainer, mapOptions);
    return map;
  });
}

/**
 * Returns a google map marker
 * @param {Object} paramObj with 4 fields
 *  - currentMap: map promise to display marker on [REQUIRED]
 *  - imageUrl: image to be used as marker icon [optional]
 *  - lat: latitude [REQUIRED]
 *  - lng: longitude [REQUIRED]
 */
function createMarker(paramObj) {
  const { currentMap, imageUrl, lat: latitude, lng: longitude } = paramObj;
  return googleApiLoader.importLibrary("marker").then(({ Marker }) => {
    return currentMap.then((map) => {
      if (imageUrl) {
        const marker = new Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          icon: imageUrl,
          zIndex: 300,
        });
        return marker;
      } else {
        const marker = new Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          zIndex: 300,
        });
        return marker;
      }
    });
  });
}

function createInfowindow(infoWindowContent) {
  return googleApiLoader.importLibrary("maps").then(({ InfoWindow }) => {
    const infoWindow = new InfoWindow({
      content: infoWindowContent,
    });
    return infoWindow;
  });
}

export {
  googleApiLoader,
  autocomplete,
  geocode,
  createMap,
  getDirections,
  userLocation,
  getDistanceFromLatLngInKm,
  createMarker,
  createInfowindow,
  clearDirections,
};
