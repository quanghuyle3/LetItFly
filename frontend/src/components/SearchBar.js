import { useEffect } from "react";
import "../css/Home.css";

function SearchBar({ Loader, currentMap, userLocation }) {
  // const [address, setAddress] = useState("");
  useEffect(() => {
    initAutocomplete();
  });

  function initAutocomplete() {
    // autocomplete will return results within these bounds
    const bayAreaBounds = {
      north: -122.6629018966861,
      south: -121.61026004010768,
      east: 37.235567063362325,
      west: 37.96328887243628,
    };

    // input element to use
    const input = document.getElementsByClassName("search-bar")[0];

    // map options
    const options = {
      bounds: bayAreaBounds,
      componentRestrictions: { country: "us" },
      fields: ["geometry"],
      type: ["airport", "geocode", "street_address", "street_number"],
    };

    let autocomplete;
    Loader.load().then(async () => {
      const { Autocomplete } = await window.google.maps.importLibrary("places");
      autocomplete = new Autocomplete(input, options);

      autocomplete.addListener("place_changed", () => {
        console.log(input.value);

        var geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: input.value }, (results, status) => {
          if (status === "OK") {
            var destinationLatitude = results[0].geometry.location.lat();
            var destinationLongitude = (destinationLatitude =
              results[0].geometry.location.lng());

            console.log(destinationLatitude, destinationLongitude);

            const marker = new window.google.maps.Marker({
              position: {
                lat: destinationLatitude,
                lng: destinationLongitude,
              },
              map: currentMap.map,
              title: input.value,
            });

            currentMap.current.panTo({
              lat: destinationLatitude,
              lng: destinationLongitude,
            });
            marker.setMap(currentMap.current);

            // Directions
            var directionsService = new window.google.maps.DirectionsService();
            var directionsRenderer =
              new window.google.maps.DirectionsRenderer();

            var user_location;
            navigator.geolocation.getCurrentPosition(
              ({ coords: { latitude, longitude } }) => {
                user_location = { lat: latitude, lng: longitude };
              }
            );

            var start = new window.google.maps.LatLng(37.3352, -121.88111);
            var end = new window.google.maps.LatLng(
              destinationLatitude,
              destinationLongitude
            );

            console.log(start, end);
            var request = {
              // origin: { lat: 37.3352, lng: -121.881 },
              origin: "San José State University, Washington Sq, San Jose, CA",
              destination: input.value,
              travelMode: "DRIVING",
            };
            directionsRenderer.setMap(currentMap.current);
            directionsService.route(request, (results, status) => {
              if (status === "OK") {
                directionsRenderer.set("directions", null);
                directionsRenderer.setDirections(results);
              } else {
                console.log(status);
              }
            });
          } else console.log(status);
        });
      });
    });
  }

  return (
    <div className="search-bar-wrapper">
      <input
        className="search-bar"
        type="text"
        placeholder="Enter address..."
      />
    </div>
  );
}

export default SearchBar;
