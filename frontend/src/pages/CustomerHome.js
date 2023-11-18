import Header from "../components/Header";
import Map from "../components/Map";
import SearchBar from "../components/SearchBar";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { userLocation } from "../components/MapUtilities";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function CustomerHome() {
  const currentRoute = useRef();
  const currentMap = useRef();
  const {
    state: { tokenObject: cookie },
  } = useLocation();

  const [distance, setDistance] = useState("0 mi");
  const [duration, setDuration] = useState("0 mins");
  const [cost, setCost] = useState("0");

  return (
    <div style={{ backgroundColor: "white", margin: "0 auto" }}>
      <Header cookie={cookie} />
      <p className="texts">
        {cookie.email ? `Welcome ${cookie.firstName}! 👋` : "Welcome username!"}
      </p>
      <SearchBar
        currentMap={currentMap}
        userLocation={userLocation}
        currentRoute={currentRoute}
        setDistance={setDistance}
        setDuration={setDuration}
        setCost={setCost}
      />
      <Map currentMap={currentMap} userLocation={userLocation} />

      <div style={{ paddingTop: "20px" }}>
        <Box
          className="route-details"
          sx={{
            marginTop: "15px",
            border: "2px solid goldenrod",
            borderRadius: "8px",
            padding: "8px",
            backgroundColor: "#fbeddb",
            minWidth: "89vw",
            margin: "10px auto",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
            Total Cost
            <Typography variant="h3" sx={{ fontWeight: "bold" }}>
              ${cost}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "8px" }}>
              <b>Distance:</b> {distance}
            </Typography>
            <Typography variant="body1">
              <b>Duration:</b> {duration}
            </Typography>
          </Typography>
        </Box>
      </div>
    </div>
  );
}

export default CustomerHome;
