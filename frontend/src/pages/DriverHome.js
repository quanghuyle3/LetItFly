import Header from "../components/Header";
import DriverMap from "../components/DriverMap";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorFallback from "./ErrorFallback";
import { checkIfJwtExpired, logout } from "../components/MapUtilities";
import { useEffect } from "react";

function DriverHome() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state = {} } = location;
  const { tokenObject: cookie } = state || {};

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      window.history.pushState(null, null, "/");
      logout(cookie.email, cookie.token);
    });
    return () => {
      window.removeEventListener("beforeunload", () => {
        logout(cookie.email, cookie.token);
      });
    };
  }, []);

  if (!cookie) {
    return <ErrorFallback />;
  }

  // check if token is expired
  if (checkIfJwtExpired(cookie.token)) {
    logout(cookie.email, cookie.token);
    navigate("/");
  }

  return (
    <>
      <Header cookie={cookie} />
      <DriverMap cookie={cookie} />
    </>
  );
}

export default DriverHome;
