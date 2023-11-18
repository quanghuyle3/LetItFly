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
  const [rideCancelled, setRideCancelled] = useState(false);

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
      .then((data) => data);

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

    Promise.all([fetchPassengerCoords, updateDriverCoords])
      .then(([passengerResponse, driverResponse]) => {
        destinationLocation.current = {
          lat: passengerResponse.curLat,
          lng: passengerResponse.curLong,
        };

        // update markers
        driverMarker.current.setPosition(driverLocation.current);
        destinationMarker.current.setPosition(destinationLocation.current);

        // check distance between passenger and driver
        let distance = getDistanceFromLatLngInKm(
          driverLocation.current,
          destinationLocation.current
        );
        const FIftyMetersInKm = 0.05;
        if (distance < FIftyMetersInKm) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setPassengerPickedUp(true);
        }
      })
      .catch((error) => {
        clearInterval(intervalRef.current);
        setRideCancelled(true);
      });
  }

  function updateDriverMarkerOnly() {
    // check for ride cancellation
    const rideRecordUrl = `${proxy}/api/ride-request/findById?id=${rideRequest.id}`;
    fetch(rideRecordUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.token,
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        clearInterval(intervalRef.current);
        setRideCancelled(true);
      });

    // if ride cancelled, exit out of function
    if (rideCancelled) return;

    // update driver marker
    userLocation.then((location) => {
      driverLocation.current = location;
      driverMarker.current.setPosition(driverLocation.current);

      // check distance between passenger and driver
      let distance = getDistanceFromLatLngInKm(
        driverLocation.current,
        destinationLocation.current
      );

      // criteria to see if ride was completed
      const FIftyMetersInKm = 0.05;
      if (distance < FIftyMetersInKm) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setRideComopleted(true);
      }
    });
  }

  // RIDE CANCELLED
  if (rideCancelled) {
    // do nothing here when cancelled, just render the cancel page
  }
  // --------------------------- PHASE 1 ---------------------------
  else if (!passengerPickedUp) {
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
    // update markers
    driverMarker.current.setPosition(driverLocation.current);
    destinationMarker.current.setMap(null);
    destinationMarker.current = null;
    createMarker({
      currentMap: currentMap.current,
      lat: destinationLocation.current.lat,
      lng: destinationLocation.current.lng,
    }).then((marker) => (destinationMarker.current = marker));

    // update markers in intervals
    intervalRef.current = setInterval(() => {
      updateDriverMarkerOnly();
    }, 3000);
  }

  function cancelRideHandler() {
    clearInterval(intervalRef.current);
    const url = `${proxy}/api/ride-request/deleteDriverIdById?id=${rideRequest.id}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.token,
      },
    })
      .then((response) => response.text())
      .then((data) => {
        if (data !== "SUCCESS")
          console.log("driver could not be removed from request");
      })
      .catch((error) => {
        console.log("error while removing driver from request: ", error);
      });
    setRideCancelled(true);
  }

  return (
    <>
      <h1>Driver Ride Page</h1>
      {rideCancelled && (
        <>
          <h2>Ride has been cancelled </h2>
          <button
            onClick={() => {
              navigate("/driver", { state: { tokenObject: cookie } });
            }}
          >
            Return to home page
          </button>
        </>
      )}
      {!rideCancelled && !rideCompleted && (
        <>
          <div id="driver-ride-map" />
          <button
            onClick={() => {
              cancelRideHandler();
            }}
          >
            Cancel Ride
          </button>
        </>
      )}
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
