import Header from "../components/Header";
import Map from "../components/Map";
import History from "../components/History";
import SearchBar from "../components/SearchBar";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

/**
 * ISSUES:
 *  - remove old routes before rendering new routes
 *  - find a way to store current location, async pain
 *  - make the directions api use lat/lng instead of strings
 *
 */

function CustomerHome() {
  const currentMap = useRef();
  const userLocation = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        userLocation.current = { lat: latitude, lng: longitude };
      }
    );
  }, []);

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
