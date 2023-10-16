import Header from "../components/Header";
import Map from "../components/Map";
import History from "../components/History";
import SearchBar from "../components/SearchBar";
import { Loader } from "@googlemaps/js-api-loader";

function CustomerHome() {
  // Initialize google map api loader
  const loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_KEY,
  });
  return (
    <>
      <Header />
      <SearchBar Loader={loader} />
      <Map Loader={loader} />
      <History />
    </>
  );
}

export default CustomerHome;
