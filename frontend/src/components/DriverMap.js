import { useRef } from "react";
import "../css/Home.css";
import {
  clearDirections,
  createInfowindow,
  createMap,
  createMarker,
  getDirections,
  getDistanceFromLatLngInKm,
  userLocation,
} from "./MapUtilities";
import carIcon from "../car.png";
import { useNavigate } from "react-router-dom";

function DriverMap({ cookie }) {
  const driverLocation = useRef();
  const rideRequestData = useRef();
  const navigate = useNavigate();
  const currentMap = useRef();
  const infoWindowRef = useRef();
  const intervalRef = useRef();

  if (!currentMap.current) {
    initMap();
  }

  const proxy = process.env.REACT_APP_BACKEND_BASE_URL;

  function initMap() {
    currentMap.current = userLocation.then((location) => {
      let zoomLevel = 13;
      return createMap(
        document.getElementById("driver-map-container"),
        location,
        zoomLevel
      );
    });
    userLocation.then(({ lat, lng }) => {
      createMarker({
        currentMap: currentMap.current,
        imageUrl: carIcon,
        lat: lat,
        lng: lng,
      });
    });
    currentMap.current.then((map) => {
      map.addListener("click", () => {
        clearDirections();
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
          infoWindowRef.current = null;
        }
      });
    });
  }

  function isRequestDistanceInScope(data) {
    // Render ride requests up to 35 kilometers to guarantee a 30 min wait time
    let passengerLocation = {
      lat: data.curLat,
      lng: data.curLong,
    };
    let distance = getDistanceFromLatLngInKm(
      driverLocation.current,
      passengerLocation
    );

    const ThirtyFiveKilometers = 3.5;
    if (distance > ThirtyFiveKilometers) return false;
    return true;
  }

  //fetch ride requests and update user location
  function getRideRequestsFromBackend() {
    const updateUserLocation = userLocation.then((location) => {
      driverLocation.current = location;
      const url = `${proxy}/api/driver-status/updateCoordinatesDriver?driverId=${cookie.id}&curLat=${location.lat}&curLong=${location.lng}`;
      return fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookie.token,
        },
      })
        .then((response) => response.text())
        .then((data) => data)
        .catch((error) => {
          console.log(
            "ERROR: couldn't update current driver location.\n",
            error
          );
          return error;
        });
    });

    const rideRequestUrl = `${proxy}/api/ride-request/findAll`;
    const getRideRequests = fetch(rideRequestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.token,
      },
    })
      .then((response) => response.json())
      .then((data) => data);

    Promise.all([updateUserLocation, getRideRequests]).then(
      ([locationUpdateStatus, data]) => {
        // create marker references if first render
        if (!rideRequestData.current) {
          rideRequestData.current = {};

          for (let i = 0; i < data.length; i++) {
            // skip request if not in scope
            if (!isRequestDistanceInScope(data[i])) continue;

            const rideRequestMarker = createMarker({
              currentMap: currentMap.current,
              lat: data[i].curLat,
              lng: data[i].curLong,
            });
            rideRequestMarker.then((marker) => {
              marker.addListener("click", () =>
                markerCallback(marker, data[i])
              );
            });

            rideRequestData.current[data[i].id] = {
              data: data[i],
              marker: rideRequestMarker,
            };
          }
          return;
        }

        // compare incoming data with rendered markers
        let markerArr = Object.keys(rideRequestData.current);
        let dataArr = [];
        let dataMap = {};
        for (let i = 0; i < data.length; i++) {
          // skip request if not in scope
          if (!isRequestDistanceInScope(data[i])) continue;

          dataArr.push(String(data[i].id));
          dataMap[data[i].id] = data[i];
        }
        let rmMarker = [];
        rmMarker = markerArr.filter((element) => !dataArr.includes(element));
        let addMarker = [];
        addMarker = dataArr.filter((element) => !markerArr.includes(element));

        // delete markers from map
        rmMarker.forEach((i) => {
          i = Number(i);
          rideRequestData.current[i].marker.then((marker) =>
            marker.setMap(null)
          );
          delete rideRequestData.current[i];
        });

        // add markers to map
        addMarker.forEach((i) => {
          i = Number(i);
          const newMarker = createMarker({
            currentMap: currentMap.current,
            lat: dataMap[i].curLat,
            lng: dataMap[i].curLong,
          });

          newMarker.then((marker) => {
            marker.addListener("click", () =>
              markerCallback(marker, dataMap[i])
            );
          });

          rideRequestData.current[i] = {
            data: dataMap[i],
            marker: newMarker,
          };
        });
      }
    );
  }
  getRideRequestsFromBackend();
  intervalRef.current = setInterval(() => {
    getRideRequestsFromBackend();
  }, 3000);

  function markerCallback(marker, data) {
    const map = marker.getMap();
    map.panTo(marker.getPosition());
    getDirections(
      { lat: data.curLat, lng: data.curLong },
      { lat: data.destLat, lng: data.destLong },
      currentMap.current
    );
    const windowData = {
      date: data.date,
      time: data.timeRequest,
      rider: data.passengerId.firstName + " " + data.passengerId.lastName,
      distance: data.distance,
      duration: data.duration,
      profit: "$" + data.cost,
    };
    createInfowindow(createInfoWindowContent(windowData)).then((infoWindow) => {
      if (infoWindowRef.current) infoWindowRef.current.close();
      infoWindowRef.current = infoWindow;
      infoWindow.open(map, marker);
      infoWindow.addListener("domready", () => {
        document.getElementById("infoButton").addEventListener("click", () => {
          updateDatabaseToAcceptRide(data).then((databaseUpdatedResponse) => {
            if (databaseUpdatedResponse !== "SUCCESS")
              console.error("ERROR: database did not get updated");
            navigate("/driver/ride", {
              state: { cookie: cookie, rideRequest: data },
            });
          });
        });
      });
    });
  }

  function updateDatabaseToAcceptRide(rideRequest) {
    const url = `${proxy}/api/ride-request/setDriverToRideRequest?driverId=${cookie.id}&rideId=${rideRequest.id}`;
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.token,
      },
    })
      .then((response) => response.text())
      .then((data) => data);
  }

  function createInfoWindowContent(data) {
    return `
      <div id="infoContent" style="padding: 0; margin: 0; font-size: 18px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Ride Request</h1>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${convertTo12Hour(data.time)}</p>
        <p><strong>Rider:</strong> ${data.rider}</p>
        <p><strong>Distance:</strong> ${data.distance}</p>
        <p><strong>Duration:</strong> ${data.duration}</p>
        <p><strong>Profit:</strong> <span style="color: green;">${
          data.profit
        }</span></p>
        <button id="infoButton" style="cursor: pointer;">Accept</button>
      </div>
    `;
  }

  function convertTo12Hour(timeString) {
    const [hours, minutes, seconds] = timeString.split(":");

    let hrs = parseInt(hours, 10);
    let mins = parseInt(minutes, 10);
    let secs = parseInt(seconds, 10);

    const suffix = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12; // the hour '0' should be '12'

    const paddedMins = mins < 10 ? `0${mins}` : mins;
    const paddedSecs = secs < 10 ? `0${secs}` : secs;

    return `${hrs}:${paddedMins}:${paddedSecs} ${suffix}`;
  }

  return (
    <>
      <p className="texts">
        {cookie.email ? `Welcome ${cookie.firstName}! 👋` : "Welcome username!"}
      </p>
      <div id="driver-map-container" />
    </>
  );
}

export default DriverMap;
