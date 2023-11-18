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
import Button from "@mui/material/Button";
import Footer from "../components/Footer";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
  }
  // --------------------------------- PHASE 1 ---------------------------------
  else if (!rideAccepted) {
    function checkRideAccepted() {
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
            rideRecord.current = data;

            fetch(
              `${proxy}/api/vehicle/findByUserId?userId=${driverId.current}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
              }
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                rideRecord.current.vehicle = data;
              });
            setRideAccepted(true);
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
    console.log(rideRecord.current.driverId);
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
      const checkRideStatus = fetch(checkRideCancelUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => error);

      Promise.all([updatePassengerCoords, getDriverCoords, checkRideStatus])
        .then(
          ([
            passengerCoordsResponse,
            DriverCoordsResponse,
            checkRideStatusResponse,
          ]) => {
            if (!checkRideStatusResponse.driverId.id) {
              clearInterval(intervalRef.current);
              setRideCancelled(true);
              return;
            }

            // // update driver location
            // driverLocation.current = {
            //   lat: DriverCoordsResponse.curLat,
            //   lng: DriverCoordsResponse.curLong,
            // };
            driverLocation.current = passengerLocation.current;
            // update marker locations
            passengerMarker.current.setPosition(passengerLocation.current);
            driverMarker.current.setPosition(driverLocation.current);

            // check distance between driver and passenger
            let distance = getDistanceFromLatLngInKm(
              passengerLocation.current,
              driverLocation.current
            );

            // criteria to check if passenger has been picked up
            const FiftyMetersInKm = 0.05;
            if (distance < FiftyMetersInKm) {
              clearInterval(intervalRef.current);
              setPassengerPickedUp(true);
            }
          }
        )
        .catch((error) => {
          clearInterval(intervalRef.current);
          setRideCancelled(true);
        });
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

      // update passenger coords
      .then(() => {
        userLocation.then((location) => (passengerLocation.current = location));
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
    function updatePassengerMarkerOnly() {
      // check if ride cancelled
      const checkRideCancelUrl = `${proxy}/api/ride-request/findById?id=${rideRequestId}`;
      const checkRideStatus = fetch(checkRideCancelUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => error);

      Promise.all([checkRideStatus, userLocation])
        .then(([rideStatus, location]) => {
          if (!rideStatus.driverId.id) {
            clearInterval(intervalRef.current);
            setRideCancelled(true);
            return;
          }

          // update passenger location
          passengerLocation.current = location;
          passengerMarker.current.setPosition(passengerLocation.current);

          // check distance between passenger and driver
          let distance = getDistanceFromLatLngInKm(
            passengerLocation.current,
            destinationLocation.current
          );

          // criteria to check if passenger has been picked up
          const FiftyMetersInKm = 0.05;
          if (distance < FiftyMetersInKm) {
            clearInterval(intervalRef.current);
            setRideCompleted(true);
          }
        })
        .catch((error) => {
          clearInterval(intervalRef.current);
          setRideCancelled(true);
        });
    }

    // update pasenger location
    userLocation
      .then((location) => (passengerLocation.current = location))

      // update route to final destination
      .then(() => {
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
      })
      .catch((error) => console.error(error))
      .then(() => {
        intervalRef.current = setInterval(() => {
          updatePassengerMarkerOnly();
        }, 3000);
      });
  }

  return (
    <>
      <Header cookie={cookie} />

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
                navigate("/customer", { state: { tokenObject: cookie } });
              }}
            >
              GO HOME
            </Button>
          </div>
        </>
      )}

      {!rideCancelled && !rideAccepted && !rideCompleted && (
        <p className="texts">WAITING FOR A DRIVER...</p>
      )}

      {!rideCancelled &&
        rideAccepted &&
        !passengerPickedUp &&
        !rideCompleted && (
          <>
            <p className="texts">DRIVER FOUND</p>
            <div>
              <Box
                className="route-details"
                sx={{
                  border: "2px solid goldenrod",
                  borderRadius: "8px",
                  padding: "8px",
                  backgroundColor: "white",
                  minWidth: "89vw",
                  margin: "5px auto",
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  Driver Information
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: "bold" }}
                  ></Typography>
                  <Typography variant="body1" sx={{ marginTop: "8px" }}>
                    <b>Driver Name:</b>
                    {rideRecord.current.driverId.firstName +
                      " " +
                      rideRecord.current.driverId.lastName}
                  </Typography>
                  <Typography variant="body1">
                    <b>License Plate:</b>
                    {rideRecord.current.vehicle[0].licensePlate}
                  </Typography>
                  <Typography variant="body1">
                    <b>Car:</b>{" "}
                    {rideRecord.current.vehicle[0].year +
                      " " +
                      rideRecord.current.vehicle[0].make[0].toUpperCase() +
                      rideRecord.current.vehicle[0].make.slice(1) +
                      " " +
                      rideRecord.current.vehicle[0].model[0].toUpperCase() +
                      rideRecord.current.vehicle[0].model.slice(1)}
                  </Typography>
                </Typography>
              </Box>
            </div>
          </>
        )}

      {!rideCancelled &&
        rideAccepted &&
        passengerPickedUp &&
        !rideCompleted && (
          <>
            <p className="texts">ENROUTE TO DESTINATION</p>
          </>
        )}

      {!rideCancelled && !rideCompleted && (
        <>
          <div id="ride-accepted-map"></div>
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
                setRideCancelled(true);
              }}
            >
              Cancel Ride
            </Button>
          </div>
        </>
      )}

      {rideCompleted && (
        <>
          <p className="texts">YOU DID IT!!!</p>
          <button
            onClick={() => {
              navigate("/customer", { state: { tokenObject: cookie } });
            }}
          >
            Go to home page
          </button>
        </>
      )}
      <footer></footer>
    </>
  );
}

export default CustomerRide;
