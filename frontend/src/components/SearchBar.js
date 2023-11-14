import { useEffect } from "react";
import "../css/Home.css";
import { autocomplete, geocode, getDirections } from "./MapUtilities";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function SearchBar({
  currentMap,
  userLocation,
  currentRoute,
  setDistance,
  setDuration,
  setCost,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    var inputElement = document.getElementsByClassName("search-bar")[0];
    autocomplete(inputElement, () => {
      geocode(inputElement.value, geocodeCallback);
    });
  });

  function geocodeCallback(results, status) {
    if (status === "OK") {
      var destinationLocation = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
      userLocation.then((userLocation) => {
        getDirections(
          userLocation,
          destinationLocation,
          currentMap.current,
          currentRoute,
          setDistance,
          setDuration,
          setCost
        );
      });
    }
  }

  function goButtonClickHandler() {
    if (!currentRoute.current) {
      return alert("Please choose a destination!");
    }

    const proxy = process.env.REACT_APP_BACKEND_BASE_URL;

    // send a POST request to backend
    const url = `${proxy}/api/ride-request/save`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + location.state.tokenObject.token,
      },
      body: JSON.stringify({
        curLat: currentRoute.current.startLat,
        curLong: currentRoute.current.startLng,
        destLat: currentRoute.current.endLat,
        destLong: currentRoute.current.endLng,
        passengerId: location.state.tokenObject.id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        navigate("/customer/ride", {
          state: { rideRequestId: data, cookie: location.state.tokenObject },
        });
      });
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "30px",
      }}
    >
      <input
        className="search-bar"
        type="text"
        placeholder="Enter address..."
      />
      <Button
        variant="contained"
        sx={{
          margin: "10px",
          marginLeft: "20px",
          height: "50px",
          backgroundColor: "goldenrod",
          color: "black",
          "&:hover": {
            backgroundColor: "goldenrod",
          },
        }}
        onClick={() => goButtonClickHandler()}
      >
        Request Ride
      </Button>
    </div>
  );
}

export default SearchBar;
