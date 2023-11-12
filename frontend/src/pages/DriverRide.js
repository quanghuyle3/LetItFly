import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  createMap,
  createMarker,
  getDirections,
  userLocation,
} from "../components/MapUtilities";
import carIcon from "../car.png";
import personIcon from "../person.png";

/**
 * TODO:
 * Phase 1:
 *  - render map with directions from current location to passenger
 *  - update current location and passenger location in real time
 *  - check distance, if distance < 50 meters ? move to phase 2
 * Phase 2:
 *  - render map with directions from current location to destination
 *  - update current location on map in real time
 *  - check distance, if distance < 50 meters ? display ride success page
 */
function Home() {
  const currentMap = useRef(null);
  const currentRoute = useRef(null);
  const driverLocation = useRef(null);
  const destinationLocation = useRef(null);
  const driverMarker = useRef(null);
  const destinationMarker = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!currentMap.current) {
      currentMap.current = userLocation.then((location) => {
        createMap(document.getElementById("passenger-pickup-map"), location);
      });
    }
  });
  const {
    state: { cookie, rideRequest },
  } = useLocation();

  const proxy = process.env.REACT_APP_BACKEND_BASE_URL;

  const [passengerPickedUp, setPassengerPickedUp] = useState(false);
  const [rideCompleted, setRideComopleted] = useState(false);

  function updateDriverPassengerMarkers() {
    const passengerUrl = `${proxy}/api/rideRequest/findById?id=${rideRequest.id}`;
    const fetchPassengerCoords = fetch(passengerUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return { lat: data.curLat, lng: data.curLong };
      });

    const updateDriverCoords = userLocation
      .then((driverCoords) => {
        driverLocation.current = driverCoords;
        const driverUrl = `${proxy}/api/driver-status/updateCoordinatesDriver?driverId=${cookie.id}&curLat=${driverCoords.lat}&curLong=${driverCoords.lng}`;

        return fetch(driverUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookie.token,
          },
        });
      })
      .then((response) => response.json())
      .then((data) => data);

    Promise.all([fetchPassengerCoords, updateDriverCoords]).then(
      ([passengerResponse, driverResponse]) => {
        console.log("promise all response");
        console.log(passengerResponse);
        console.log(driverResponse);
      }
    );
  }

  // --------------------------- PHASE 1 ---------------------------
  if (!passengerPickedUp) {
    // Render directions to pickup passenger
    if (!currentRoute.current) {
      userLocation.then((location) => {
        driverLocation.current = location;
        destinationLocation.current = {
          lat: rideRequest.curLat,
          lng: rideRequest.curLong,
        };
        getDirections(
          driverLocation.current,
          destinationLocation.current,
          currentMap,
          currentRoute
        );
      });

      // Create markers
      driverMarker.current = createMarker({
        currentMap: currentMap.current,
        imageUrl: carIcon,
        lat: driverLocation.current.lat,
        lng: driverLocation.current.lng,
      });
      destinationMarker.current = createMarker({
        currentMap: currentMap.current,
        imageUrl: personIcon,
        lat: destinationLocation.current.lat,
        lng: destinationLocation.current.lng,
      });
    }
    // Route already rendered, just update markers
    else {
      updateDriverPassengerMarkers();
    }
  }

  // --------------------------- PHASE 2 ---------------------------
  else if (passengerPickedUp && !rideCompleted) {
    console.log("we're in phase 2 now");
    // do something
  }

  // ---------------------- RIDE COMPLETED -----------------------
  else {
    console.log("ride has been completed now");
    // ride completed page
  }

  return (
    <>
      <h1>Driver Ride Page</h1>
      {!passengerPickedUp && <div id="passenger-pickup-map" />}
      {passengerPickedUp && !rideCompleted && <div id="destination-map" />}
    </>
  );
}

export default Home;
