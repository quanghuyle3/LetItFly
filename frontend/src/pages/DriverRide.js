import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Home.css";
import {
  createMap,
  createMarker,
  getDirections,
  getDistanceFromLatLngInKm,
  userLocation,
} from "../components/MapUtilities";
import carIcon from "../car.png";
import personIcon from "../person.png";

function Home() {
  const currentMap = useRef(null);
  const currentRoute = useRef(null);
  const driverLocation = useRef(null);
  const destinationLocation = useRef(null);
  const driverMarker = useRef(null);
  const destinationMarker = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  const {
    state: { cookie, rideRequest },
  } = useLocation();

  const proxy = process.env.REACT_APP_BACKEND_BASE_URL;

  const [passengerPickedUp, setPassengerPickedUp] = useState(false);
  const [rideCompleted, setRideComopleted] = useState(false);

  // Initialize map
  if (!currentMap.current) {
    currentMap.current = userLocation.then((location) => {
      return createMap(document.getElementById("driver-ride-map"), location);
    });
  }

  function updateDriverPassengerMarkers() {
    const passengerUrl = `${proxy}/api/ride-request/findById?id=${rideRequest.id}`;
    const fetchPassengerCoords = fetch(passengerUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        destinationLocation.current = { lat: data.curLat, lng: data.curLong };
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
      .then((response) => response.text())
      .then((data) => data);

    Promise.all([fetchPassengerCoords, updateDriverCoords]).then(
      ([passengerResponse, driverResponse]) => {
        // update markers
        driverMarker.current.setPosition(driverLocation.current);
        destinationMarker.current.setPosition(destinationLocation.current);

        // check distance between passenger and driver
        let distance = getDistanceFromLatLngInKm(
          driverLocation.current.lat,
          driverLocation.current.lng,
          destinationLocation.current.lat,
          destinationLocation.current.lng
        );
        console.log("distance: ", distance);
        const FIftyMetersInKm = 0.05;
        if (distance < FIftyMetersInKm) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setPassengerPickedUp(true);
        }
      }
    );
  }

  function updateDriverMarkerOnly() {
    userLocation.then((location) => {
      driverLocation.current = location;
      driverMarker.current.setPosition(driverLocation.current);

      // check distance between passenger and driver
      let distance = getDistanceFromLatLngInKm(
        driverLocation.current.lat,
        driverLocation.current.lng,
        destinationLocation.current.lat,
        destinationLocation.current.lng
      );
      console.log("distance: ", distance);
      const FIftyMetersInKm = 0.05;
      if (distance < FIftyMetersInKm) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setRideComopleted(true);
      }
    });
  }

  // --------------------------- PHASE 1 ---------------------------
  if (!passengerPickedUp) {
    // Render directions to pickup passenger
    userLocation
      .then((location) => {
        driverLocation.current = location;
        destinationLocation.current = {
          lat: rideRequest.curLat,
          lng: rideRequest.curLong,
        };
        getDirections(
          driverLocation.current,
          destinationLocation.current,
          currentMap.current,
          currentRoute
        );
        // Create markers
        createMarker({
          currentMap: currentMap.current,
          imageUrl: carIcon,
          lat: driverLocation.current.lat,
          lng: driverLocation.current.lng,
        }).then((marker) => (driverMarker.current = marker));
        destinationMarker.current = createMarker({
          currentMap: currentMap.current,
          imageUrl: personIcon,
          lat: destinationLocation.current.lat,
          lng: destinationLocation.current.lng,
        }).then((marker) => (destinationMarker.current = marker));
      })
      // Update markers after rendering markers
      .then(() => {
        intervalRef.current = setInterval(() => {
          updateDriverPassengerMarkers();
        }, 3000);
      });
    // DELETE THIS <----------------------------
    setTimeout(() => {
      clearInterval(intervalRef.current);
    }, 15000);
  }

  // --------------------------- PHASE 2 ---------------------------
  else if (!rideCompleted) {
    destinationLocation.current = {
      lat: rideRequest.destLat,
      lng: rideRequest.destLong,
    };
    // Render route to final destination
    getDirections(
      driverLocation.current,
      destinationLocation.current,
      currentMap.current
    );
    // Create markers
    driverMarker.current.setPosition(driverLocation.current);
    destinationMarker.current.setPosition(destinationLocation.current);

    // update markers in intervals
    intervalRef.current = setInterval(() => {
      updateDriverMarkerOnly();
    }, 3000);

    // DELETE THIS <----------------------------
    setTimeout(() => {
      clearInterval(intervalRef.current);
    }, 15000);
  }

  return (
    <>
      <h1>Driver Ride Page</h1>
      {!rideCompleted && <div id="driver-ride-map" />}
      {rideCompleted && (
        <>
          <h1>Congratulations, you completed the ride!</h1>
          <button
            onClick={() => {
              navigate("/driver", { state: { tokenObject: cookie } });
            }}
          >
            Return to home page
          </button>
        </>
      )}
    </>
  );
}

export default Home;
