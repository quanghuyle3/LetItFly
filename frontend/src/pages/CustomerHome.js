import Header from "../components/Header";
import Map from "../components/Map";
import History from "../components/History";
import SearchBar from "../components/SearchBar";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * ISSUES:
 *  - remove old routes before rendering new routes
 *  - find a way to store current location, async pain
 *  - make the directions api use lat/lng instead of strings
 *
 */

function CustomerHome() {
  const currentMap = useRef();

  // wrap user location in a promise
  const userLocation = new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          resolve({ lat: latitude, lng: longitude });
        }
      );
    } else {
      reject(null);
    }
  });

  const location = useLocation();
  console.log("logging cookie:", location.state);
  // Initialize google map api loader

  return (
    <>
      <Header />
      {/* <SearchBar currentMap={currentMap} userLocation={userLocation} /> */}
      <Map currentMap={currentMap} userLocation={userLocation} />
      <History />
    </>
  );
}

export default CustomerHome;
