import { useEffect } from "react";
import "../css/Home.css";
import { createMap, createMarker } from "./MapUtilities";

function Map({ currentMap, userLocation }) {
  useEffect(() => {
    if (!currentMap.current) {
      initMap();
    }
  });
  function initMap() {
    userLocation.then((location) => {
      const map = createMap(
        document.getElementsByClassName("map-container")[0],
        location
      );
      currentMap.current = map;
      createMarker({
        currentMap: currentMap.current,
        lat: location.lat,
        lng: location.lng,
      });
    });
  }

  // initMap();

  return (
    <>
      <div className="map-container" />
    </>
  );
}

export default Map;
