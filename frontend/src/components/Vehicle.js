import "../css/Settings.css";
import { Fragment, useEffect } from "react";
import React, { useState } from "react";
import Alert from "@mui/material/Alert";

function Vehicle(param) {
  const [userInfo, setUserInfo] = useState(null);
  const [noDelete, setNoDelete] = useState(null);
  const num = Number(param.number);
  const cookie = param.cookie;

  useEffect(() => {
    fetch(
      `http://localhost:8080/api/vehicle/findByUserId?userId=${cookie.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookie.token,
        },
      }
    ).then((response) => {
      response.json().then((jsonObject) => {
        setUserInfo(jsonObject);
      });
    });
  }, []);

  const handleDel = () => {
    setNoDelete(false);
    if (userInfo.length === 1) {
      setNoDelete(true);
      setTimeout(() => {
        setNoDelete(false);
      }, 5000);
    } else {
      fetch(
        `http://localhost:8080/api/vehicle/setToNotUse?id=${userInfo[num].id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookie.token,
          },
        }
      )
        .then((response) => {
          return response.text();
        })
        .then((result) => {
          console.log(result);
          if (result == "UPDATED") {
            window.location.reload();
            alert("Delete Successfull");
          } else {
            alert("Delete Unsucessfull");
          }
        })
        .catch((error) => {
          console.error("Delete failed:", error);
        });
    }
  };

  return (
    <div className="row">
      {userInfo !== null && userInfo[num].inUse == true ? (
        <div>
          <h3>Vehicle {num + 1}: </h3>
          <p>License Plate: {userInfo[num].licensePlate}</p>
          <p>Make: {userInfo[num].make}</p>
          <p>Model: {userInfo[num].model}</p>
          <p>Year: {userInfo[num].year}</p>
          <p>Type: {userInfo[num].type}</p>
          <button onClick={handleDel}>Delete Vehicle</button>
        </div>
      ) : (
        <p>No Vehicles</p>
      )}
      {noDelete && (
        <div>
          <Alert variant="filled" severity="error" sx={{ mb: 2, mt: 2 }}>
            Cannot delete - Must have at least one vehicle!
          </Alert>
        </div>
      )}
    </div>
  );
}
export default Vehicle;
