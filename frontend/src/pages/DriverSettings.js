import React from "react";
import Settings from "../components/Settings";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

function DriverSettings() {
  const location = useLocation(); 
  return (
    <>
      <Header cookie={location.state.cookie}/>
      <Settings cookie={location.state.cookie}/>
    </>
  );
}

export default DriverSettings;
