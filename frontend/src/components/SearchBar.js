import { useEffect } from "react";
import "../css/Home.css";
import { autocomplete, geocode, getDirections } from "./MapUtilities";

function SearchBar({
  currentMap,
  userLocation,
  currentRoute,
  setDistance,
  setDuration,
  setCost,
}) {
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
        getDirections(
          userLocation,
          destinationLocation,
          currentMap.current,
          currentRoute,
          setDistance,
          setDuration,
          setCost
        );
      });
    }
  }

  function goButtonClickHandler() {
    if (!currentRoute.current) {
      return alert("Please choose a destination!");
    }

    // send a POST request to backend
    const url = "";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentLat: currentRoute.current.startLat,
        currentLat: currentRoute.current.startLng,
        destLat: currentRoute.current.endLat,
        destLat: currentRoute.current.endLng,
      }),
    });
  }

  return (
    <div className="search-bar-wrapper">
      <input
        className="search-bar"
        type="text"
        placeholder="Enter address..."
      />
      <button id="go-button" onClick={() => goButtonClickHandler()}>
        START
      </button>
    </div>
  );
}

export default SearchBar;
