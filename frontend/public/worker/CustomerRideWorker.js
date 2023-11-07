//import { userLocation } from "../../src/components/MapUtilities";
/**
 * AFTER RIDE ACCEPTED, BEFORE PICKUP
 * make sure i update passenger coords with:
 * /updateCoordinatesPassenger
 *
 * /api/driver-status
 * findByDriverId(driverId) -> returns whole record -> look at "curLat", "curLong"
 */

/**
 * ISSUES:
 *  - customerRideWorker sends multiple messages when driverId has been assigned, could be problematic
 */

var driverIdPollCount = 0;
const afterRideAccepted = "AFTER RIDE ACCEPTED";
const driverLocationReceieved = "DRIVER LOCATION RECEIVED";

function driverIdPoll(proxy, token, rideRequestId) {
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
      if (!data.driverId) {
        if (driverIdPollCount > 5) {
          console.log("ending poll: ", data);
        } else {
          driverIdPollCount += 1;
          console.log(driverIdPollCount);
          setTimeout(() => {
            driverIdPoll(proxy, token, rideRequestId);
          }, 5000);
        }
      } else {
        console.log("posting message: ", data);
        postMessage({
          responseString: afterRideAccepted,
          driverId: data.driverId,
        });
      }
    });
}

function locationPoll(proxy, token, rideRequestId, driverId, passengerCoords) {
  const passengerUrl = `${proxy}/api/ride-request/updateCoordinatesPassenger?rideRequestId=${rideRequestId}&curLat=${passengerCoords.lat}&curLong=${passengerCoords.lng}`;
  const updatePassengerCoords = fetch(passengerUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
  .then((response) => {
    console.log(response);
    return response.json();
  })
  .then((data) => {
    return data;
  });
  
  const driverUrl = `${proxy}/api/driver-status/findByDriverId?driverId=${driverId}`;
    const getDriverCoords = fetch(driverUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        return data;
      });
      Promise.all([updatePassengerCoords, getDriverCoords]).then((values) => {
        console.log(values);
      });
}

/*
event.data format:
typeString, token, url, param1, param2, ...
*/
onmessage = (event) => {

  if (event.data.typeString === "BEFORE RIDE ACCEPTED") {
    driverIdPoll(event.data.proxy, event.data.token, event.data.param1);
  }

  if (event.data.typeString === "RIDE ACCEPTED, BEFORE PICKUP") {
    // create this function
    // update passenger coords and read driver coords until some sort of trigger
    // figure out how to stop the poll, what will be the trigger?
    console.log(event.data);
    locationPoll(event.data.proxy, event.data.token, event.data.param1, event.data.param2, event.data.param3);
  }
};
