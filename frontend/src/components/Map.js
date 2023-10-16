import { Loader } from "@googlemaps/js-api-loader";
import "../css/Home.css";
import { useState, useRef } from "react";

function Map() {
  const [address, setAddress] = useState("");
  const currentLocation = useRef();
  const loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_KEY,
  });

  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      currentLocation.center = { lat: latitude, lng: longitude };
      console.log(`lat: ${latitude}, lng: ${longitude}`);
    }
  );
  loader.load().then(async () => {
    const { Map } = await window.google.maps.importLibrary("maps");
    let map = new Map(document.getElementsByClassName("map-container")[0], {
      center: currentLocation.center,
      zoom: 14,
      disableDefaultUI: true,
    });
    currentLocation.map = map;
  });

  return (
    <>
      <div className="search-bar-wrapper">
        <input
          className="search-bar"
          type="text"
          placeholder="Enter address..."
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
      </div>
      <div className="map-container"></div>
    </>
  );
}

export default Map;
