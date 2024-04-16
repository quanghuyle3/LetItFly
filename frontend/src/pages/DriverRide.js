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
import Header from "../components/Header";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Home() {
  const currentMap = useRef(null);
  const currentRoute = useRef(null);
  const driverLocation = useRef(null);
  const destinationLocation = useRef(null);
  const driverMarker = useRef(null);
  const destinationMarker = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const routeStep = useRef(0);

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
    const passengerUrl = `http://${proxy}/api/ride-request/findById?id=${rideRequest.id}`;
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
        // define max step index
        let maxStep =
          currentRoute.current.path.routes[0].overview_path.length - 1;
        if (routeStep.current > maxStep) routeStep.current = maxStep;

        // overwrite actual coords with route step array
        driverCoords =
          currentRoute.current.path.routes[0].overview_path[routeStep.current];

        driverLocation.current = {
          lat: driverCoords.lat(),
          lng: driverCoords.lng(),
        };
        const driverUrl = `http://${proxy}/api/driver-status/updateCoordinatesDriver?driverId=${cookie.id}&curLat=${driverLocation.current.lat}&curLong=${driverLocation.current.lng}`;

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

        // passenger picked up if the final coordinate has been arrived
        let maxStep =
          currentRoute.current.path.routes[0].overview_path.length - 1;

        if (distance < FIftyMetersInKm || routeStep.current >= maxStep) {
          clearInterval(intervalRef.current);
          routeStep.current = 0;
          intervalRef.current = null;
          setPassengerPickedUp(true);
        }
        routeStep.current++;
      })
      .catch((error) => {
        console.log(error);
        clearInterval(intervalRef.current);
        setRideCancelled(true);
      });
  }

  function updateDriverMarkerOnly() {
    // check for ride cancellation
    const rideRecordUrl = `http://${proxy}/api/ride-request/findById?id=${rideRequest.id}`;
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
      let maxStep =
        currentRoute.current.path.routes[0].overview_path.length - 1;
      if (routeStep.current > maxStep) routeStep.current = maxStep;

      // overwrite actual coords with route step array
      location =
        currentRoute.current.path.routes[0].overview_path[routeStep.current];

      driverLocation.current = {
        lat: location.lat(),
        lng: location.lng(),
      };

      driverMarker.current.setPosition(driverLocation.current);

      // check distance between passenger and driver
      let distance = getDistanceFromLatLngInKm(
        driverLocation.current,
        destinationLocation.current
      );

      // criteria to see if ride was completed
      const FIftyMetersInKm = 0.05;
      if (distance < FIftyMetersInKm || routeStep.current >= maxStep) {
        routeStep.current = 0;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setRideComopleted(true);
      }

      routeStep.current++;
    });
  }

  // RIDE CANCELLED
  if (rideCancelled) {
    clearInterval(intervalRef.current);
    const url = `http://${proxy}/api/ride-request/deleteDriverIdById?id=${rideRequest.id}`;
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
        }, 500);
      });
  }

  // --------------------------- PHASE 2 ---------------------------
  else if (!rideCompleted) {
    destinationLocation.current = {
      lat: rideRequest.destLat,
      lng: rideRequest.destLong,
    };

    userLocation
      .then((location) => (driverLocation.current = location))

      // Render route to final destination
      .then(() => {
        getDirections(
          driverLocation.current,
          destinationLocation.current,
          currentMap.current,
          currentRoute
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
      })
      .then(() => {
        // update markers in intervals
        intervalRef.current = setInterval(() => {
          updateDriverMarkerOnly();
        }, 500);
      });
  }

  function cancelRideHandler() {
    setRideCancelled(true);
  }

  return (
    <>
      <Header
        cookie={cookie}
        requestId={rideRequest.id}
        interval={intervalRef}
      />

      {rideCancelled && (
        <>
          <Alert variant="filled" severity="error" sx={{ margin: "20px" }}>
            Ride has been cancelled!
          </Alert>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                margin: "10px auto",
                height: "40px",
                backgroundColor: "goldenrod",
                color: "black",
                "&:hover": {
                  backgroundColor: "goldenrod",
                },
              }}
              onClick={() => {
                navigate("/driver", { state: { tokenObject: cookie } });
              }}
            >
              RETURN TO HOME PAGE
            </Button>
          </div>
        </>
      )}
      {!rideCancelled && !rideCompleted && !passengerPickedUp && (
        <p className="texts">ROUTING TO PASSENGER</p>
      )}

      {!rideCancelled && !rideCompleted && passengerPickedUp && (
        <p className="texts">ENROUTE TO DESTINATION</p>
      )}

      {!rideCancelled && !rideCompleted && (
        <>
          <div id="driver-ride-map" />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                margin: "10px auto",
                height: "40px",
                backgroundColor: "goldenrod",
                color: "black",
                "&:hover": {
                  backgroundColor: "goldenrod",
                },
              }}
              onClick={() => {
                cancelRideHandler();
              }}
            >
              Cancel Ride
            </Button>
          </div>
        </>
      )}
      {rideCompleted && (
        <>
          <p className="texts">RIDE COMPLETED</p>
          <div>
            <Box
              className="route-details"
              sx={{
                border: "2px solid goldenrod",
                borderRadius: "8px",
                padding: "8px",
                backgroundColor: "#fbeddb",
                minWidth: "89vw",
                margin: "5px auto",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ textAlign: "center" }}
              >
                <u>Ride Summary</u>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: "bold" }}
                ></Typography>
                <Typography variant="body1" sx={{ marginTop: "8px" }}>
                  <b>Total Cost: </b> ${currentRoute.current.cost}
                </Typography>
                <Typography variant="body1">
                  <b>Ride Duration:</b> {currentRoute.current.duration}
                </Typography>
                <Typography variant="body1">
                  <b>Total Distance:</b> {currentRoute.current.distance}
                </Typography>
              </Typography>
            </Box>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                margin: "10px auto",
                height: "40px",
                backgroundColor: "goldenrod",
                color: "black",
                "&:hover": {
                  backgroundColor: "goldenrod",
                },
              }}
              onClick={() => {
                navigate("/driver", { state: { tokenObject: cookie } });
              }}
            >
              RETURN TO HOME PAGE
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default Home;
