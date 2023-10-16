import { useEffect, useRef, useState } from "react";
import "../css/Home.css";

function SearchBar({ Loader }) {
  // const [address, setAddress] = useState("");
  useEffect(() => {
    initAutocomplete();
  }, []);

  function initAutocomplete() {
    // autocomplete will return results within these bounds
    const bayAreaBounds = {
      north: -122.6629018966861,
      south: -121.61026004010768,
      east: 37.235567063362325,
      west: 37.96328887243628,
    };

    // input element to use
    const input = document.getElementsByClassName("search-bar")[0];

    // map options
    const options = {
      bounds: bayAreaBounds,
      componentRestrictions: { country: "us" },
      fields: ["geometry"],
      type: ["airport", "geocode", "street_address", "street_number"],
    };

    let autocomplete;
    Loader.load().then(async () => {
      const { Autocomplete } = await window.google.maps.importLibrary("places");
      autocomplete = new Autocomplete(input, options);

      autocomplete.addListener("place_changed", () => {
        console.log(input.value);

        const place = autocomplete.getPlace();
        console.log({ place });
        console.log(place.geometry.location.lat());
        console.log(place.geometry.location.lng());
      });
    });
  }

  return (
    <div className="search-bar-wrapper">
      <input
        className="search-bar"
        type="text"
        placeholder="Enter address..."
        // onChange={(e) => setAddress(e.target.value)}
        // value={address}
      />
    </div>
  );
}

export default SearchBar;
