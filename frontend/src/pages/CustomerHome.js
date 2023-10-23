import Header from "../components/Header";
import Map from "../components/Map";
import History from "../components/History";
import SearchBar from "../components/SearchBar";
import { Loader } from "@googlemaps/js-api-loader";
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
  // const userLocation = new Promise((resolve, reject) => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       ({ coords: { latitude, longitude } }) => {
  //         resolve({ lat: latitude, lng: longitude });
  //       }
  //     );
  //   } else {
  //     reject(null);
  //   }
  // });

  const userLocation = useRef();
  const location = useLocation();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        userLocation.current = { lat: latitude, lng: longitude };
      }
    );
  }, []);
  console.log(location.state);
  // Initialize google map api loader

  const loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_KEY,
  });
  return (
    <>
      <Header />
      <SearchBar
        Loader={loader}
        currentMap={currentMap}
        userLocation={userLocation}
      />
      <Map
        Loader={loader}
        currentMap={currentMap}
        userLocation={userLocation}
      />
      <History />
    </>
  );
}

export default CustomerHome;
