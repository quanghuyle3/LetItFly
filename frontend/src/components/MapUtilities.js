import { Loader } from "@googlemaps/js-api-loader";

// Haversine formula
function getDistanceFromLatLngInKm(lat1, lon1, lat2, lon2) {
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

/**
 *
 * @param {lat: current_latitude, lng: current_longitude} currentLocation
 * @param {lat: destination_latitude, lng: destination_longitude} destinationLocation
 * @param {Promise} currentMap
 * @param {useRef} currentRoute
 * @returns
 */
var directionsRenderer;
var directionsService;
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
        if (directionsRenderer.getMap() != map) directionsRenderer.setMap(map);
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
        currentRoute.current = {
          distance: results.routes[0].legs[0].distance.text,
          duration: results.routes[0].legs[0].duration.text,
          cost: (
            (Number(results.routes[0].legs[0].distance.value) / 1609.34 - 2) /
              5 +
            15
          ).toFixed(2),
          startLat: results.routes[0].legs[0].start_location.lat(),
          startLng: results.routes[0].legs[0].start_location.lng(),
          endLat: results.routes[0].legs[0].end_location.lat(),
          endLng: results.routes[0].legs[0].end_location.lng(),
        };
        if (setDistance) setDistance(currentRoute.current.distance);
        if (setDuration) setDuration(currentRoute.current.duration);
        if (setCost) setCost(currentRoute.current.cost);
      });
    });
}

function createMap(mapContainer, centerCoords) {
  const mapOptions = {
    center: centerCoords,
    zoom: 17,
    disableDefaultUI: true,
    clickableIcons: false,
  };

  return googleApiLoader.importLibrary("maps").then(({ Map }) => {
    var map = new Map(mapContainer, mapOptions);
    return map;
  });
}


function createInfoWindowContent(data) {
  return `
    <div id="infoContent" style="padding: 0; margin: 0;">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Ride Request</h1>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Time:</strong> ${convertTo12Hour(data.time)}</p>
      <p><strong>Rider:</strong> ${data.rider}</p>
      <p><strong>Duration:</strong> ${data.duration}</p>
      <p><strong>Profit:</strong> <span style="color: green;">${data.profit}</span></p>
      <button id="infoButton" style="width: 100%; background-color: rgb(242, 201, 98); border: none; padding: 10px 0; box-sizing: border-box;">Accept</button>
    </div>
  `;
}


function updateInfoWindow(infoWindow, data) {
  const newContent = createInfoWindowContent(data);
  infoWindow.setContent(newContent);
}

function convertTo12Hour(timeString) {
  const [hours, minutes, seconds] = timeString.split(':');

  let hrs = parseInt(hours, 10);
  let mins = parseInt(minutes, 10);
  let secs = parseInt(seconds, 10);

  const suffix = hrs >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hrs = hrs % 12;
  hrs = hrs ? hrs : 12; // the hour '0' should be '12'

  const paddedMins = mins < 10 ? `0${mins}` : mins;
  const paddedSecs = secs < 10 ? `0${secs}` : secs;

  return `${hrs}:${paddedMins}:${paddedSecs} ${suffix}`;
}

function createMarker(map, infoWindow, data, passLat, passedLng) {
    return googleApiLoader.importLibrary("marker").then(({ Marker }) => {
        const image =
            "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

        map.then((actualMap) => {
            //console.log("Passed", typeof passLat, typeof passedLng)
            const marker = new Marker({
                position: { lat: passLat, lng: passedLng },
                map: actualMap
               // icon: image,
            });
            //click event
            marker.addListener("click", function () {
                actualMap.setCenter(marker.getPosition());
                infoWindow.then((actualWindow) => {
                  //update
                  console.log(typeof(data.timeRequest));
                  const windowData = {
                      date: data.date,
                      time: convertTo12Hour(data.timeRequest),
                      rider: data.passengerId.firstName + " " + data.passengerId.lastName,
                      duration: data.duration,
                      profit: "$" + data.cost
                  };
                  updateInfoWindow(actualWindow, windowData)
                  actualWindow.open(actualMap, marker);
                });
            });
            return marker;
        })
      })
    }

/**
 * Returns a google map marker
 * @param {Object} paramObj with 4 fields
 *  - currentMap: map object to display marker on [REQUIRED]
 *  - imageUrl: image to be used as marker icon [optional]
 *  - lat: latitude [REQUIRED]
 *  - lng: longitude [REQUIRED]
 */
function createRideMarker(paramObj) {
  const {
    currentMap: currentMap,
    imageUrl: imageUrl,
    lat: latitude,
    lng: longitude,
  } = paramObj;
  return googleApiLoader.importLibrary("marker").then(({ Marker }) => {
    return currentMap.then((map) => {
      if (imageUrl) {
        const marker = new Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          icon: imageUrl,
        });
        return marker;
      } else {
        const marker = new Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
        });
        return marker;
      }
    });
  });
}

function createMarker(map, passLat, passedLng) {
  return googleApiLoader.importLibrary("marker").then(({ Marker }) => {
    const image =
      "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

    map.then((actualMap) => {
      //console.log("Passed", typeof passLat, typeof passedLng)
      const marker = new Marker({
        position: { lat: passLat, lng: passedLng },
        map: actualMap,
        icon: image,
      });
      //click event
      marker.addListener("click", function () {
        actualMap.setCenter(marker.getPosition());
      });
      //marker.setMap(map);
      //console.log("Marker", marker);
      //console.log("THIS IS THE MAP qweeqw: ", map);
      return marker;
    });
  });
}

function createInfowindow(infoWindowContent) {
  return googleApiLoader.importLibrary('maps').then(({ InfoWindow }) => {
    const infoWindow = new InfoWindow({
      content: infoWindowContent
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
  createMarker,
  createInfowindow,
  getDistanceFromLatLngInKm,
  createRideMarker,
};
 