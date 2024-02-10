import React, { useEffect } from "react";
import Settings from "../components/Settings";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { checkIfJwtExpired, logout } from "../components/MapUtilities";
import ErrorFallback from "./ErrorFallback";

function DriverSettings() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      window.history.pushState(null, null, "/");
      logout(location.state.cookie.email, location.state.cookie.token);
    });
    return () => {
      window.removeEventListener("beforeunload", () => {
        logout(location.state.cookie.email, location.state.cookie.token);
      });
    };
  }, []);

  if (!location.state) return <ErrorFallback />;

  // check if token is expired
  if (checkIfJwtExpired(location.state.cookie.token)) {
    logout(location.state.cookie.email, location.state.cookie.token);
    navigate("/");
  }

  return (
    <>
      <Header cookie={location.state.cookie} />
      <Settings cookie={location.state.cookie} />
    </>
  );
}

export default DriverSettings;
