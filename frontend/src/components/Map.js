import "../css/Home.css";

function Map({ Loader, currentMap, userLocation }) {
  function initMap() {
    userLocation.then((coords) => {
      console.log(coords.lat, coords.lng);
      const mapOptions = {
        center: coords,
        zoom: 15,
        disableDefaultUI: true,
        clickableIcons: false,
      };

      Loader.load().then(async () => {
        const { Map } = await window.google.maps.importLibrary("maps");

        const map = new Map(
          document.getElementsByClassName("map-container")[0],
          mapOptions
        );
        currentMap.current = map;
      });
    });
  }

  initMap();

  return <div className="map-container"></div>;
}

export default Map;
