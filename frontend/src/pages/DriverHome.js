import Header from "../components/Header";
import DriverMap from "../components/DriverMap";
import { useLocation } from "react-router-dom";

function DriverHome() {
  const {
    state: { tokenObject: cookie },
  } = useLocation();

  return (
    <>
      <Header cookie={cookie} />
      <DriverMap cookie={cookie} />
    </>
  );
}

export default DriverHome;
