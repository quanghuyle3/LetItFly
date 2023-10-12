import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerHome from "./pages/CustomerHome";
import CustomerSettings from "./pages/CustomerSettings";
import CustomerHistory from "./pages/CustomerHistory";
import CustomerRide from "./pages/CustomerRide";
import DriverHome from "./pages/DriverHome";
import DriverSettings from "./pages/DriverSettings";
import DriverRide from "./pages/DriverRide";
import DriverHistory from "./pages/DriverHistory";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      // Root route = login page
      <Route>
        <Route
          path="/"
          element={<Login />}
        />
        // {/* REGISTER PAGE */}
        <Route
          path="/register"
          element={<Register />}
        />
        {/* CUSTOMER ROUTING */}
        <Route
          path="/customer/home"
          element={<CustomerHome />}
        />
        <Route
          path="/customer/settings"
          element={<CustomerSettings />}
        />
        <Route
          path="/customer/history"
          element={<CustomerHistory />}
        />
        <Route
          path="/customer/ride"
          element={<CustomerRide />}
        />
        {/* DRIVER ROUTING */}
        <Route
          path="/driver/home"
          element={<DriverHome />}
        />
        <Route
          path="/driver/settings"
          element={<DriverSettings />}
        />
        <Route
          path="/driver/history"
          element={<DriverHistory />}
        />
        <Route
          path="/driver/ride"
          element={<DriverRide />}
        />
      </Route>
    )
  );
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
