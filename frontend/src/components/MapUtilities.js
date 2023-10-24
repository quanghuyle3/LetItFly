import { Loader } from "@googlemaps/js-api-loader";

// reusable loader with api key
const googleApiLoader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_KEY,
});

/**
 * Given a destination string, return the lat and lng coords
 * @param {String} destinationString
 */
function geocode(destinationString) {
  googleApiLoader.importLibrary("geocoding").then(({ Geocoder }) => {
    var geocoder = new Geocoder();
    geocoder.geocode({ address: destinationString }, (results, status) => {
      if (status === "OK") {
        return {
          destinationLat: results[0].geometry.location.lat(),
          destinationLng: results[0].geometry.location.lng(),
        };
      } else return {};
    });
  });
}

// Expectation: given an input element, return set of destination coords
function autocompleteAndGeocode(inputElement) {
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
    autocomplete.addListener("place_changed", () => {
      console.log(inputElement.value);
      return geocode(inputElement.value);
    });
  });
}

function createMap(mapContainer, centerCoords) {
  const mapOptions = {
    center: centerCoords,
    zoom: 15,
    disableDefaultUI: true,
    clickableIcons: false,
  };

  googleApiLoader.importLibrary("maps").then(({ Map }) => {
    var map = new Map(mapContainer, mapOptions);
    return map;
  });
}

export { googleApiLoader, autocompleteAndGeocode, geocode, createMap };
