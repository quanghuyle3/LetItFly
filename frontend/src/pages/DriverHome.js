import Header from "../components/Header";
import DriverMap from "../components/DriverMap";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { createMarker, userLocation } from "../components/MapUtilities";

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
