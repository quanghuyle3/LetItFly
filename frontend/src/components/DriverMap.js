import { useRef } from "react";
import "../css/Home.css";
import {
  clearDirections,
  createInfowindow,
  createMap,
  createMarker,
  getDirections,
  userLocation,
} from "./MapUtilities";
import carIcon from "../car.png";
import { useNavigate } from "react-router-dom";

function DriverMap({ cookie }) {
  const navigate = useNavigate();
  const currentMap = useRef();
  const infoWindowRef = useRef();

  if (!currentMap.current) {
    initMap();
  }
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

  //fetch ride requests
  const proxy = process.env.REACT_APP_BACKEND_BASE_URL;
  const url = `${proxy}/api/ride-request/findAll`;

  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + cookie.token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        const rideRequestMarker = createMarker({
          currentMap: currentMap.current,
          lat: data[i].curLat,
          lng: data[i].curLong,
        });
        rideRequestMarker.then((marker) => {
          marker.addListener("click", () => markerCallback(marker, data[i]));
        });
      }
    });

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
      time: convertTo12Hour(data.timeRequest),
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
          navigate("/driver/ride", {
            state: { cookie: cookie, rideRequest: data },
          });
        });
      });
    });
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

    const suffix = hrs >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12; // the hour '0' should be '12'

    const paddedMins = mins < 10 ? `0${mins}` : mins;
    const paddedSecs = secs < 10 ? `0${secs}` : secs;

    return `${hrs}:${paddedMins}:${paddedSecs} ${suffix}`;
  }

  return (
    <>
      <div id="driver-map-container" />
    </>
  );
}

export default DriverMap;
