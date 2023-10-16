import "../css/Home.css";
import { useRef, useEffect } from "react";

function Map({ Loader }) {
  const currentMap = useRef();
  useEffect(() => {
    initMap();
  }, []);

  function initMap() {
    // Get user's current location
    var user_location;
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        user_location = { lat: latitude, lng: longitude };
      }
    );

    // load the map onto the page
    let map;
    Loader.load().then(async () => {
      const { Map } = await window.google.maps.importLibrary("maps");

      map = new Map(document.getElementsByClassName("map-container")[0], {
        center: user_location,
        zoom: 15,
        disableDefaultUI: true,
        clickableIcons: false,
      });
    });

    currentMap.current = map;
  }

  return <div className="map-container"></div>;
}

export default Map;
