import Header from "../components/Header";
import DriverMap from "../components/DriverMap";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { createMarker, userLocation } from "../components/MapUtilities";

/**
 * TODO:
 *  - get ride requests from database
 *  - display a marker for each of the ride requests
 *  - on hovering over a marker, display a small box with distance, duration, profit
 *  - on click of infobox, render a route from pickup location to destination
 *  - on click of button inside infobox, move to driverRide page
 */
function DriverHome() {
  const currentMap = useRef();
  const {
    state: { tokenObject: cookie },
  } = useLocation();

  return (
    <>
      <Header cookie={cookie} />
      <DriverMap
        currentMap={currentMap}
        userLocation={userLocation}
        cookie={cookie}
      />
    </>
  );
}

export default DriverHome;
