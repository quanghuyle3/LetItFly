import { useLocation, useNavigate } from "react-router-dom";
import {
  createMap,
  createMarker,
  getDirections,
  getDistanceFromLatLngInKm,
  userLocation,
} from "../components/MapUtilities";
import { useState, useRef } from "react";
import pickupIcon from "../person.png";
import carIcon from "../car.png";
import Header from "../components/Header";

function CustomerRide() {
  const {
    state: {
      rideRequestId,
      cookie,
      cookie: { token },
    },
  } = useLocation();
  const navigate = useNavigate();

  const intervalRef = useRef(null);
  const driverId = useRef(null);
  const passengerLocation = useRef(null);
  const driverLocation = useRef(null);
  const destinationLocation = useRef(null);
  const currentRoute = useRef(null);
  const currentMap = useRef(null);
  const passengerMarker = useRef(null);
  const driverMarker = useRef(null);
  const rideRecord = useRef(null);

  const [rideAccepted, setRideAccepted] = useState(false);
  const [passengerPickedUp, setPassengerPickedUp] = useState(false);
  const [rideCompleted, setRideCompleted] = useState(false);
  const [rideCancelled, setRideCancelled] = useState(false);

  const proxy = process.env.REACT_APP_BACKEND_BASE_URL;

  function initMap(mapElementId) {
    currentMap.current = userLocation.then((location) => {
      let zoomLevel = 13;
      passengerLocation.current = location;
      return createMap(
        document.getElementById(mapElementId),
        location,
        zoomLevel
      );
    });
  }

  if (!currentMap.current) initMap("ride-accepted-map");

  if (rideCancelled) {
    console.log("ride request cancelled!");
  }
  // --------------------------------- PHASE 1 ---------------------------------
  else if (!rideAccepted) {
    function checkRideAccepted() {
      console.log("checking");
      const url = `${proxy}/api/ride-request/findById?id=${rideRequestId}`;
      return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.driverId) {
            clearInterval(intervalRef.current);
            driverId.current = data.driverId.id;
            destinationLocation.current = {
              lat: data.destLat,
              lng: data.destLong,
            };
            setRideAccepted(true);
            rideRecord.current = data;
          }
        });
    }

    checkRideAccepted();
    intervalRef.current = setInterval(() => {
      checkRideAccepted();
    }, 3000);
  }
  // --------------------------------- PHASE 2 ---------------------------------
  else if (!passengerPickedUp) {
    var c1 = 1;
    function updatePassengerDriverLocation() {
      const updatePassengerCoords = userLocation.then((passengerCoords) => {
        passengerLocation.current = passengerCoords;
        const passengerUrl = `${proxy}/api/ride-request/updateCoordinatesPassenger?rideRequestId=${rideRequestId}&curLat=${passengerCoords.lat}&curLong=${passengerCoords.lng}`;
        return fetch(passengerUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
          .then((response) => response.text())
          .then((data) => data);
      });

      const driverUrl = `${proxy}/api/driver-status/findByDriverId?driverId=${driverId.current}`;
      const getDriverCoords = fetch(driverUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => data);

      const checkRideCancelUrl = `${proxy}/api/ride-request/findById?id=${rideRequestId}`;
      const checkRideCancel = fetch(checkRideCancelUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.driverId.id) {
            console.log(data.driverId.id);
            setRideAccepted(false);
            return data;
          }
        })
        .catch((error) => {
          clearInterval(intervalRef.current);
          setRideCancelled(true);
          return "RIDE CANCELLED";
        });

      Promise.all([
        updatePassengerCoords,
        getDriverCoords,
        checkRideCancel,
      ]).then(
        ([
          passengerCoordsResponse,
          DriverCoordsResponse,
          checkRideCancelResponse,
        ]) => {
          // exit function if ride cancelled
          if (!rideAccepted || rideCancelled) return;

          if (c1 < 2) {
            driverLocation.current = {
              lat: DriverCoordsResponse.curLat,
              lng: DriverCoordsResponse.curLong,
            };
          } else if (c1 < 3) {
            driverLocation.current = {
              lat: 37.342430731542294,
              lng: -121.85440702637351,
            };
          } else {
            driverLocation.current = {
              lat: 37.33045462745464,
              lng: -121.88346056553847,
            };
          }
          c1++;

          // update marker locations
          passengerMarker.current.setPosition(passengerLocation.current);
          driverMarker.current.setPosition(driverLocation.current);

          // check distance between driver and passenger
          let distance = getDistanceFromLatLngInKm(
            passengerLocation.current.lat,
            passengerLocation.current.lng,
            driverLocation.current.lat,
            driverLocation.current.lng
          );
          console.log("distance: ", distance, "km");

          // criteria to check if passenger has been picked up
          const FiftyMetersInKm = 0.5;
          if (distance < FiftyMetersInKm) {
            clearInterval(intervalRef.current);
            setPassengerPickedUp(true);
          }
        }
      );
    }

    // get driver location
    const driverUrl = `${proxy}/api/driver-status/findByDriverId?driverId=${driverId.current}`;
    fetch(driverUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((driverRecord) => {
        driverLocation.current = {
          lat: driverRecord.curLat,
          lng: driverRecord.curLong,
        };
      })

      // render route between driver and passenger
      .then(() => {
        getDirections(
          passengerLocation.current,
          driverLocation.current,
          currentMap.current,
          currentRoute
        );
      })

      // Create markers
      .then(() => {
        createMarker({
          currentMap: currentMap.current,
          lat: passengerLocation.current.lat,
          lng: passengerLocation.current.lng,
          imageUrl: pickupIcon,
        }).then((marker) => (passengerMarker.current = marker));
        createMarker({
          currentMap: currentMap.current,
          lat: driverLocation.current.lat,
          lng: driverLocation.current.lng,
          imageUrl: carIcon,
        }).then((marker) => (driverMarker.current = marker));

        intervalRef.current = setInterval(() => {
          updatePassengerDriverLocation();
        }, 3000);
      });
  }

  // --------------------------------- PHASE 3 ---------------------------------
  else if (!rideCompleted) {
    var c2 = 1;
    function updatePassengerMarkerOnly() {
      // check if ride cancelled
      const checkRideCancelUrl = `${proxy}/api/ride-request/findById?id=${rideRequestId}`;
      fetch(checkRideCancelUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.driverId.id) {
            console.log(data.driverId.id);
            setPassengerPickedUp(false);
            setRideAccepted(false);
            return data;
          }
        })
        .catch((error) => {
          clearInterval(intervalRef.current);
          setRideCancelled(true);
          return "RIDE CANCELLED";
        });

      // exit function if ride cancelled
      if (!rideAccepted || rideCancelled) return;

      userLocation.then((location) => {
        if (c2 < 2) passengerLocation.current = location;
        else if (c2 < 3)
          passengerLocation.current = {
            lat: 37.476584650800355,
            lng: -122.17503098766385,
          };
        else
          passengerLocation.current = {
            lat: 37.615352393734575,
            lng: -122.38988933765685,
          };
        c2++;

        passengerMarker.current.setPosition(passengerLocation.current);

        // check distance between passenger and driver
        let distance = getDistanceFromLatLngInKm(
          passengerLocation.current.lat,
          passengerLocation.current.lng,
          destinationLocation.current.lat,
          destinationLocation.current.lng
        );
        console.log("destination distance: ", distance, "km");

        // criteria to check if passenger has been picked up
        const FiftyMetersInKm = 0.6;
        if (distance < FiftyMetersInKm) {
          console.log("ride complete!!");
          clearInterval(intervalRef.current);
          setRideCompleted(true);
        }
      });
    }

    // update route to final destination
    getDirections(
      passengerLocation.current,
      destinationLocation.current,
      currentMap.current,
      currentRoute
    );
    // update markers
    driverMarker.current.setMap(null);
    passengerMarker.current.setPosition(passengerLocation.current);
    createMarker({
      currentMap: currentMap.current,
      lat: destinationLocation.current.lat,
      lng: destinationLocation.current.lng,
    });

    intervalRef.current = setInterval(() => {
      updatePassengerMarkerOnly();
    }, 3000);
  }

  function cancelRideHandler() {
    clearInterval(intervalRef.current);
    const url = `${proxy}/api/ride-request/delete?id=${rideRequestId}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.text())
      .then((data) => {
        if (data !== "SUCCESS")
          console.log("ride request delete operation failed");
      })
      .catch((error) => {
        console.log("error while deleting: ", error);
      });
    setRideCancelled(true);
  }

  return (
    <>
      <Header cookie={cookie} />
      <h1>Customer Ride Page</h1>

      {rideCancelled && (
        <>
          <h2>The ride has been cancelled!</h2>
          <button
            onClick={() => {
              console.log("returned to home page");
              navigate("/customer", { state: { tokenObject: cookie } });
            }}
          >
            Go to home page
          </button>
        </>
      )}

      {!rideCancelled && !rideAccepted && !rideCompleted ? (
        <h1>WAITING FOR RIDE ...</h1>
      ) : !rideCancelled && !rideCompleted ? (
        <h1>RIDE HAS BEEN ACCEPTED!!!!!</h1>
      ) : (
        <></>
      )}

      {!rideCancelled && !rideCompleted && (
        <>
          <div id="ride-accepted-map"></div>
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
          <h1>YOU DID IT!!!</h1>
          <button
            onClick={() => {
              console.log("returned to home page");
              navigate("/customer", { state: { tokenObject: cookie } });
            }}
          >
            Go to home page
          </button>
        </>
      )}
    </>
  );
}

export default CustomerRide;
