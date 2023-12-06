import "../css/Settings.css";
import { Fragment, useEffect } from "react";
import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import dayjs from "dayjs";

function Card(param) {
  const [userInfo, setUserInfo] = useState(null);
  const [noDelete, setNoDelete] = useState(false);
  const num = Number(param.number);
  const cookie = param.cookie;

  useEffect(() => {
    fetch(
      `http://localhost:8080/api/payment/findByUserId?userId=${cookie.id}`,
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
        `http://localhost:8080/api/payment/setToNotUse?id=${userInfo[num].id}`,
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
          <h3>Card: {num + 1} </h3>
          <label className="label-settings" for="name">
            Name:
          </label>
          <p id="name">{userInfo[num].name}</p>
          <label className="label-settings" for="number">
            Number:
          </label>
          <p id="number">
            {"************" + userInfo[num].cardNumber.substring(12, 16)}
          </p>
          <label className="label-settings" for="type">
            Type:
          </label>
          <p id="type">{userInfo[num].type}</p>
          <label className="label-settings" for="exp">
            Expiration:
          </label>
          <p id="exp">day{dayjs(userInfo[num].expiration).format("MM/YYYY")}</p>
          <label className="label-settings" for="address">
            Billing Address:
          </label>
          <p id="address">{userInfo[num].billingAddress}</p>
          <button onClick={handleDel}>Delete Card</button>
          {noDelete && (
            <div>
              <Alert variant="filled" severity="error" sx={{ mb: 2, mt: 2 }}>
                Cannot delete - Must have at least one card!
              </Alert>
            </div>
          )}
        </div>
      ) : (
        <p>No Cards</p>
      )}
    </div>
  );
}
export default Card;
