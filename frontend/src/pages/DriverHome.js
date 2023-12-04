import Header from "../components/Header";
import DriverMap from "../components/DriverMap";
import { useLocation, Navigate } from "react-router-dom";
import ErrorFallback from "./ErrorFallback";

function DriverHome() {
  const location = useLocation();
  const { state = {} } = location;
  const { tokenObject: cookie } = state || {};

  if (!cookie) {
    return <ErrorFallback />;
  }
  
  return (
    <>
      <Header cookie={cookie} />
      <DriverMap cookie={cookie} />
    </>
  );
}

export default DriverHome;
