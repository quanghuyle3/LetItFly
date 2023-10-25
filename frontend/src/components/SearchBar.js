import { useEffect } from "react";
import "../css/Home.css";
import { autocomplete, geocode, getDirections } from "./MapUtilities";

function SearchBar({ currentMap, userLocation }) {
  useEffect(() => {
    var inputElement = document.getElementsByClassName("search-bar")[0];
    autocomplete(inputElement, () => {
      geocode(inputElement.value, geocodeCallback);
    });
  });

  function geocodeCallback(results, status) {
    if (status === "OK") {
      var destinationLocation = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
      userLocation.then((userLocation) => {
        getDirections(userLocation, destinationLocation, currentMap.current);
      });
    }
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
