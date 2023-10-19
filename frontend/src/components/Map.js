import "../css/Home.css";

function Map({ Loader, currentMap, userLocation }) {
  function initMap() {
    // Get user's current location, this can be memoized
    // var user_location;
    // navigator.geolocation.getCurrentPosition(
    //   ({ coords: { latitude, longitude } }) => {
    //     user_location = { lat: latitude, lng: longitude };
    //   }
    // );

    // load the map onto the page

    Loader.load().then(async () => {
      const { Map } = await window.google.maps.importLibrary("maps");

      const map = new Map(document.getElementsByClassName("map-container")[0], {
        center: userLocation.current,
        zoom: 15,
        disableDefaultUI: true,
        clickableIcons: false,
      });
      currentMap.current = map;
    });
  }

  initMap();

  return <div className="map-container"></div>;
}

export default Map;
