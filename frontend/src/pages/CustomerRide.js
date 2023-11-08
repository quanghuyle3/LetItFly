import { useLocation, useNavigate } from "react-router-dom";
import {
  createMap,
  createRideMarker,
  getDirections,
  getDistanceFromLatLngInKm,
  userLocation,
} from "../components/MapUtilities";
import { useState, useRef, useEffect } from "react";
import pickupIcon from "../person.png";
import carIcon from "../car.png";

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

function CustomerRide() {
  const {
    state: {
      rideRequestId: rideRequestId,
      cookie: cookie,
      cookie: { token: token },
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
  var c = 1;
  customerRideWorker.onmessage = (e) => {
    // PHASE 1 ON MESSAGE
    if (e.data.responseString === "AFTER RIDE ACCEPTED") {
      driverId.current = e.data.driverId.id;
      setRideAccepted(true);
    }
    // PHASE 2 ON MESSAGE
    else if (e.data.responseString === "DRIVER LOCATION RECEIVED") {
      if (c < 2) driverLocation.current = e.data.driverCoords;
      // Route already rendered
      if (currentRoute.current) {
        // update marker positions
        passengerMarker.current.setPosition({
          lat: passengerLocation.current.lat,
          lng: passengerLocation.current.lng,
        });

        // 37.32981760103271, -121.89016722367852

        if (c >= 2 && c < 3) {
          driverLocation.current = {
            lat: 37.33839581,
            lng: -121.89426123,
          };
        }

        if (c > 3) {
          driverLocation.current.lat = 37.329682;
          driverLocation.current.lng = -121.89051473;
        }
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
        c++;

        // criteria to check if passenger has been picked up
        const FiftyMetersInKm = 1; // FIX VALUE LATER TO 0.05
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
        createRideMarker({
          currentMap: currentMap.current,
          lat: passengerLocation.current.lat,
          lng: passengerLocation.current.lng,
          imageUrl: pickupIcon,
        }).then((marker) => {
          passengerMarker.current = marker;
        });

        // Create driver marker
        createRideMarker({
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
      console.log(rideRecord.current);
      destinationLocation.current = e.data.destination;
      getDirections(
        passengerLocation.current,
        destinationLocation.current,
        currentMap.current,
        currentRoute
      );
      // update passenger marker
      createRideMarker({
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
      var c2 = 1;
      function updateMarkerLocation() {
        userLocation
          .then((location) => {
            if (c2 < 2) {
              c2++;
              passengerMarker.current.setPosition(location);
              passengerLocation.current = location;
            } else if (c2 < 4) {
              c2++;
              const pos = { lat: 37.33109791490554, lng: -121.88377082875157 };
              passengerMarker.current.setPosition(pos);
              passengerLocation.current = pos;
            } else {
              c2++;
              const pos = { lat: 37.334171276018736, lng: -121.88046319744207 };
              passengerMarker.current.setPosition(pos);
              passengerLocation.current = pos;
            }
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
      <h1>Customer Ride Page</h1>

      {!rideAccepted && <h1>WAITING FOR RIDE ...</h1>}
      {!passengerPickedUp && rideAccepted && (
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
    </>
  );
}

export default CustomerRide;
