import { useEffect } from "react";
import "../css/Home.css";
import { createMap } from "./MapUtilities";
import { createMarker } from "../components/MapUtilities";

function DriverMap({ currentMap, userLocation, cookie}) {
    useEffect(() => {
        if (!currentMap.current) {
            initMap();
        }
    });
    function initMap() {
        userLocation.then((location) => {
            const map = createMap(
                document.getElementsByClassName("map-container")[0],
                location
            );
            currentMap.current = map;
            //fetch ride requests
            const proxy = process.env.REACT_APP_BACKEND_BASE_URL
            const url = `${proxy}/api/ride-request/findAll`
            fetch(url, {headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + cookie.token,
            }}).then(response => response.json()).then(data => {
                for (let i = 0; i < data.length; i++) {
                    //console.log('Latitude:', typeof data[i].curLat, 'Longitude:', typeof data[i].curLong);
                    const marker = createMarker(
                        map,
                        data[i].curLat,
                        data[i].curLong
                    )
                }
            })
            // make marker
            //const marker = createMarker(
            //    map
           // );
        });
    }


    // initMap();

    return (
        <>
            <div className="map-container" />
        </>
    );
}

export default DriverMap;