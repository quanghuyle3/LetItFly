import { useLocation, useNavigate } from "react-router-dom";
import {
  createMap,
  createMarker,
  getDirections,
  getDistanceFromLatLngInKm,
  userLocation,
} from "../components/MapUtilities";
import { useState, useRef, useEffect } from "react";
import Map from "../components/Map";
import pickupIcon from "../person.png";
import carIcon from "../car.png";
import Header from "../components/Header";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Footer from "../components/Footer";


function CustomerRide() {
  const {
    state: {
      rideRequestId,
      cookie,
      cookie: { token },
    },
  } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (rideAccepted && !passengerPickedUp) initMap("ride-accepted-map");
    if (passengerPickedUp && !rideCompleted) initMap("passenger-picked-up-map");
  });

  const driverId = useRef(null);
  const afterRideAcceptedInterval = useRef(null);
  const afterPassengerPickupInterval = useRef(null);
  const passengerLocation = useRef(null);
  const driverLocation = useRef(null);
  const destinationLocation = useRef(null);
  const currentRoute = useRef(null);
  const currentMap = useRef(null);
  const passengerMarker = useRef(null);
  const driverMarker = useRef(null);
  const rideRecord = useRef(null);

  const beforeRideAccepted = "BEFORE RIDE ACCEPTED";
  const rideAcceptedBeforePickup = "RIDE ACCEPTED, BEFORE PICKUP";
  const afterPickup = "AFTER PICKUP";

  const [rideAccepted, setRideAccepted] = useState(false);
  const [passengerPickedUp, setPassengerPickedUp] = useState(false);
  const [rideCompleted, setRideCompleted] = useState(false);
  const customerRideWorker = new Worker("/worker/CustomerRideWorker.js");

  const proxy = process.env.REACT_APP_BACKEND_BASE_URL;

  function workerPhaseTwoPostMessage() {
    userLocation.then((coords) => {
      passengerLocation.current = coords;
      customerRideWorker.postMessage({
        proxy: proxy,
        typeString: rideAcceptedBeforePickup,
        token: token,
        param1: rideRequestId,
        param2: driverId.current,
        param3: coords,
      });
    });
  }

  function initMap(mapElementId) {
    userLocation.then((location) => {
      currentMap.current = createMap(
        document.getElementById(mapElementId),
        location
      );
    });
  }

  /*
          --------- POST MESSAGE ---------
   */
  // PHASE 1 POST MESSAGE
  if (!rideAccepted) {
    customerRideWorker.postMessage({
      proxy: proxy,
      typeString: beforeRideAccepted,
      token: token,
      param1: rideRequestId,
    });
  }
  // PHASE 2 POST MESSAGE
  else if (!passengerPickedUp) {
    workerPhaseTwoPostMessage();
    afterRideAcceptedInterval.current = setInterval(() => {
      workerPhaseTwoPostMessage();
    }, 3000);
  }
  // PHASE 3
  else if (passengerPickedUp && rideAccepted && !rideCompleted) {
    customerRideWorker.postMessage({
      proxy: proxy,
      typeString: afterPickup,
      token: token,
      param1: rideRequestId,
    });
  }

  /*
          --------- ONMESSAGE ---------
   */
  customerRideWorker.onmessage = (e) => {
    // PHASE 1 ON MESSAGE
    if (e.data.responseString === "AFTER RIDE ACCEPTED") {
      driverId.current = e.data.driverId.id;
      setRideAccepted(true);
    }
    // PHASE 2 ON MESSAGE
    else if (e.data.responseString === "DRIVER LOCATION RECEIVED") {
      driverLocation.current = e.data.driverCoords;
      // Route already rendered
      if (currentRoute.current) {
        // update marker positions
        passengerMarker.current.setPosition({
          lat: passengerLocation.current.lat,
          lng: passengerLocation.current.lng,
        });
        driverMarker.current.setPosition({
          lat: driverLocation.current.lat,
          lng: driverLocation.current.lng,
        });
        // check distance between driver and passenger
        let distance = getDistanceFromLatLngInKm(
          passengerLocation.current.lat,
          passengerLocation.current.lng,
          driverLocation.current.lat,
          driverLocation.current.lng
        );
        console.log("driver distance: ", distance, "km");

        // criteria to check if passenger has been picked up
        const FiftyMetersInKm = 0.05;
        if (distance < FiftyMetersInKm) {
          console.log("picked up passenger!!");
          clearInterval(afterRideAcceptedInterval.current);
          setPassengerPickedUp(true);
        }
        // DELETE LATER <------------------------------
        setTimeout(() => {
          clearInterval(afterRideAcceptedInterval.current);
        }, 20000);
      }

      // Render route between driver and passenger
      else {
        getDirections(
          passengerLocation.current,
          driverLocation.current,
          currentMap.current,
          currentRoute
        );

        // Create passenger marker
        createMarker({
          currentMap: currentMap.current,
          lat: passengerLocation.current.lat,
          lng: passengerLocation.current.lng,
          imageUrl: pickupIcon,
        }).then((marker) => {
          passengerMarker.current = marker;
        });

        // Create driver marker
        createMarker({
          currentMap: currentMap.current,
          lat: driverLocation.current.lat,
          lng: driverLocation.current.lng,
          imageUrl: carIcon,
        }).then((marker) => {
          driverMarker.current = marker;
        });
      }
    }
    // PHASE 3 ON MESSAGE
    else if (e.data.responseString === "FINAL DESTINATION RETRIEVED") {
      rideRecord.current = e.data.record;
      destinationLocation.current = e.data.destination;
      getDirections(
        passengerLocation.current,
        destinationLocation.current,
        currentMap.current,
        currentRoute
      );
      // update passenger marker
      createMarker({
        currentMap: currentMap.current,
        imageUrl: carIcon,
        lat: passengerLocation.current.lat,
        lng: passengerLocation.current.lng,
      })
        .then((marker) => {
          passengerMarker.current = marker;
        })
        .then(() => {
          afterPassengerPickupInterval.current = setInterval(
            updateMarkerLocation,
            3000
          );
          setTimeout(() => {
            clearInterval(afterPassengerPickupInterval.current);
          }, 20000);
        });

      function updateMarkerLocation() {
        userLocation
          .then((location) => {
            passengerMarker.current.setPosition(location);
            passengerLocation.current = location;
          })
          .then(() => {
            let distance = getDistanceFromLatLngInKm(
              passengerLocation.current.lat,
              passengerLocation.current.lng,
              destinationLocation.current.lat,
              destinationLocation.current.lng
            );
            console.log("destination distance: ", distance, "km");
            const FiftyMetersInKm = 0.05;
            if (distance < FiftyMetersInKm) {
              clearInterval(afterPassengerPickupInterval.current);
              setRideCompleted(true);
            }
          });
      }
    }
  };

  return (
    <>
    <div>
      <Header cookie={cookie} />
      {!rideAccepted && (
        <>
          <p className="texts">Waiting for Ride...</p>
          <Map currentMap={currentMap} userLocation={userLocation} />


        </>
      )}
      {!passengerPickedUp && rideAccepted && (
        <>
          <p className="texts">Driver Found</p>
          <div style={{ paddingTop: "20px" }}>
        <Box
          className="route-details"
          sx={{
            marginTop: "15px",
            border: "2px solid goldenrod",
            borderRadius: "8px",
            padding: "8px",
            backgroundColor: "white",
            minWidth: "89vw",
            margin: "10px auto",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
            Driver Details
          </Typography>
        </Box>
      </div>
          <div id="ride-accepted-map"></div>
          <button
            onClick={() => {
              console.log("interval stopped");
              clearInterval(afterRideAcceptedInterval.current);
            }}
          >
            stop interval
          </button>
        </>
      )}
      {passengerPickedUp && rideAccepted && !rideCompleted && (
        <>
          <h1>PASSENGER PICKED UP!!</h1>
          <div id="passenger-picked-up-map"></div>
          <button
            onClick={() => {
              console.log("interval stopped");
              clearInterval(afterPassengerPickupInterval.current);
            }}
          >
            stop interval
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
    </div>
    </>
    
  );
}

export default CustomerRide;
