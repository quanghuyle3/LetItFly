import { useLocation } from "react-router-dom";

function Home() {
  const {
    state: { cookie, rideRequest },
  } = useLocation();
  console.log(cookie, rideRequest);

  return <h1>Driver Ride Page</h1>;
}

export default Home;
