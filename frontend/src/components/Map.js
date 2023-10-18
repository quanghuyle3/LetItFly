import React, { useMemo, useCallback, useRef } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import "../css/Home.css";

function Map() {
  const mapRef = useRef();
  const center = useMemo(() => ({ lat: 37.3352, lng: -121.8811 }), []);
  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading ...</div>;

  return (
    <GoogleMap
      zoom={16}
      center={center}
      mapContainerClassName="map-container"
      options={options}
      onLoad={onLoad}
    >
      <form>
        <input
          className="search-bar"
          placeholder="Search Address..."
          type="text"
        ></input>
      </form>
    </GoogleMap>
  );
}

export default Map;
