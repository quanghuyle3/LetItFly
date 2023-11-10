import { useLocation } from "react-router-dom";

/**
 * TODO:
 * Phase 1:
 *  - render map with directions from current location to passenger
 *  - update current location and passenger location in real time
 *  - check distance, if distance < 50 meters ? move to phase 2
 * Phase 2:
 *  - render map with directions from current location to destination
 *  - update current location on map in real time
 *  - check distance, if distance < 50 meters ? display ride success page
 */
function Home() {
  const {
    state: { cookie, rideRequest },
  } = useLocation();
  console.log(cookie, rideRequest);

  return <h1>Driver Ride Page</h1>;
}

export default Home;
