import { useLocation } from "react-router-dom";
import {
  createMap,
  getDirections,
  getDistanceFromLatLngInKm,
  userLocation,
} from "../components/MapUtilities";
import { useState, useRef, useEffect } from "react";

/*
    BEFORE RIDE ACCEPTED
    ::Display::
    "Loading ..."

    ::Background::
    /api/ride-request
    getDriverIdOfRideRequest(ride request id) -> returns driverId
      -1 ? keep polling : driver found = driver id 

    AFTER RIDE ACCEPTED, BEFORE PICKUP
    ::Display::
    display map with route between current location and driver location
    update driver and customer markers

    ::Background::
    make sure i update passenger coords with: 
    /updateCoordinatesPassenger

    /api/driver-status
    findByDriverId(driverId) -> returns whole record -> look at "curLat", "curLong"

    move to next phase after distance between driver & passenger < 0.05 km using haversine formula

    AFTER PASSENGER PICKUP
    ::Display::
    display map with current location and destination location
    -- no need to interact with database anymore
*/

/**
 * ISSUES:
 *  - customerRideWorker sends multiple messages when driverId has been assigned, could be problematic
 */

/**
 * PHASE 2 TODO:
 *  - create marker for passenger with person picture
 *  - create marker for driver with car picture
 *  - update passenger and driver marker
 *  - check distance between driver and passenger, and if < 0.05 ? move to phase 3
 *  - wrap the above marker position change and distance checking in a handler function
 */

function CustomerRide() {
  const {
    state: {
      rideRequestId: rideRequestId,
      cookie: { token: token },
    },
  } = useLocation();

  useEffect(() => {
    if (rideAccepted) initMap();
  });

  const driverId = useRef(null);
  const afterRideAcceptedInterval = useRef(null);
  const passengerLocation = useRef(null);
  const driverLocation = useRef(null);
  const currentRoute = useRef(null);
  const currentMap = useRef(null);

  const beforeRideAccepted = "BEFORE RIDE ACCEPTED";
  const rideAcceptedBeforePickup = "RIDE ACCEPTED, BEFORE PICKUP";
  const afterPickup = "AFTER PICKUP";

  const [rideAccepted, setRideAccepted] = useState(false);
  const [passengerPickedUp, setPassengerPickedUp] = useState(false);
  const customerRideWorker = new Worker("/worker/CustomerRideWorker.js", {
    type: "module",
  });

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

  if (!rideAccepted) {
    customerRideWorker.postMessage({
      proxy: proxy,
      typeString: beforeRideAccepted,
      token: token,
      param1: rideRequestId,
    });
  } else if (!passengerPickedUp) {
    //phase 2
    workerPhaseTwoPostMessage();
    afterRideAcceptedInterval.current = setInterval(() => {
      workerPhaseTwoPostMessage();
    }, 3000);
  } else {
    //phase 3
  }
  customerRideWorker.onmessage = (e) => {
    if (e.data.responseString === "AFTER RIDE ACCEPTED") {
      driverId.current = e.data.driverId.id;
      setRideAccepted(true);
    } else if (e.data.responseString === "DRIVER LOCATION RECEIVED") {
      driverLocation.current = e.data.driverCoords;
      console.log("driver coords: ", e.data.driverCoords);
      if (currentRoute.current) {
        let d = getDistanceFromLatLngInKm(
          passengerLocation.current.lat,
          passengerLocation.current.lng,
          driverLocation.current.lat,
          driverLocation.current.lng
        );
        console.log("driver distance: ", d, "km");
      } else {
        console.log("yes routing");
        getDirections(
          passengerLocation.current,
          driverLocation.current,
          currentMap.current,
          currentRoute
        );
      }

      setTimeout(() => {
        clearInterval(afterRideAcceptedInterval.current);
      }, 10000);
      //call function to update marker
    }
  };

  function initMap() {
    userLocation.then((location) => {
      currentMap.current = createMap(
        document.getElementById("ride-accepted-map"),
        location
      );
    });
  }

  return (
    <>
      <h1>Customer Ride Page</h1>
      {!rideAccepted ? (
        <h1>WAITING FOR RIDE ...</h1>
      ) : (
        <>
          <h1>RIDE HAS BEEN ACCEPTED!!!!!</h1>
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
    </>
  );
}

export default CustomerRide;
