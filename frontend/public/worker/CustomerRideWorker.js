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
    .then((response) => response.text())
    .then((data) => data);

  const driverUrl = `${proxy}/api/driver-status/findByDriverId?driverId=${driverId}`;
  const getDriverCoords = fetch(driverUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((data) => data);
  Promise.all([updatePassengerCoords, getDriverCoords]).then(
    ([passengerCoordsResponse, DriverCoordsResponse]) => {
      postMessage({
        responseString: driverLocationReceieved,
        driverCoords: {
          lat: DriverCoordsResponse.curLat,
          lng: DriverCoordsResponse.curLong,
        },
      });
    }
  );
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
    locationPoll(
      event.data.proxy,
      event.data.token,
      event.data.param1,
      event.data.param2,
      event.data.param3
    );
  }
};
