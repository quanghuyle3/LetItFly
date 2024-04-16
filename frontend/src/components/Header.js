import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import logo from "../logo.png";

function Header({ cookie, requestId, interval }) {
  const location = useLocation();
  const navigate = useNavigate();
  const proxy = process.env.REACT_APP_BACKEND_BASE_URL;
  const customerRideDelete = () => {
    clearInterval(interval.current);
    const url = `http://${proxy}/api/ride-request/delete?id=${requestId}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.token,
      },
    })
      .then((response) => response.text())
      .then((data) => {
        if (data !== "SUCCESS")
          console.log("ride request delete operation failed");
      })
      .catch((error) => {
        console.log("error while deleting: ", error);
      });
  };

  const driverDelete = () => {
    clearInterval(interval.current);
    const url = `http://${proxy}/api/ride-request/deleteDriverIdById?id=${requestId}`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookie.token,
      },
    })
      .then((response) => response.text())
      .then((data) => {
        if (data !== "SUCCESS")
          console.log("driver could not be removed from request");
      })
      .catch((error) => {
        console.log("error while removing driver from request: ", error);
      });
  }

  const handleCustomerRideSettings = () => {
    if (
      window.confirm(
        "Are you sure you want to go to settings? Your ride will get cancelled."
      )
    ) {
      customerRideDelete();
      navigate("/customer/settings", { state: { cookie: cookie } });
    }
  };

  const handleDriverRideSettings = () => {
    if (
      window.confirm(
        "Are you sure you want to go to settings? Your ride will get cancelled."
      )
    ) {
      driverDelete();
      navigate("/driver/settings", { state: { cookie: cookie } });
    }
  };

  const handleRideLogout = () => {
    if (
      window.confirm(
        "Are you sure you want to logout? Your ride will get cancelled."
      )
    ) {
      cookie.roleName === "ROLE_DRIVER" ? driverDelete() : customerRideDelete();
      navigate("/");
    }
  };

  const handleRideLogo = () => {
    if (
      window.confirm(
        "Are you sure you want to go the home page? Your ride will get cancelled."
      )
    ) {
      cookie.roleName === "ROLE_DRIVER" ? driverDelete() : customerRideDelete();
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#fbeddb", overflow: "hidden" }}>
      <Toolbar>
        {!location.pathname.includes("ride") && (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link
              to={cookie.roleName === "ROLE_DRIVER" ? "/driver" : "/customer"}
              state={{ tokenObject: cookie }}
            >
              <img
                className="header-left"
                src={logo}
                alt="Let It Fly Logo"
                height="70px"
                width="auto"
                maxWidth="30%"
              />
            </Link>
          </Typography>
        )}
        {location.pathname.includes("ride") && (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link
              onClick={handleRideLogo}
              to={cookie.roleName === "ROLE_DRIVER" ? "/driver" : "/customer"}
              state={{ tokenObject: cookie }}
            >
              <img
                className="header-left"
                src={logo}
                alt="Let It Fly Logo"
                height="70px"
                width="auto"
                maxWidth="30%"
              />
            </Link>
          </Typography>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "left",
            color: "black",
          }}
        >
          {!location.pathname.includes("ride") && (
            <>
              <Button
                color="inherit"
                component={Link}
                to={
                  cookie.roleName === "ROLE_DRIVER"
                    ? "/driver/settings"
                    : "/customer/settings"
                }
                state={{ cookie: cookie }}
                sx={{ fontSize: "18px", marginRight: "30px" }}
                className="Button"
              >
                Settings
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{ fontSize: "18px" }}
                className="Button"
              >
                Logout
              </Button>
            </>
          )}
          {location.pathname.includes("customer") &&
            location.pathname.includes("ride") && (
              <>
                <Button
                  color="inherit"
                  onClick={handleCustomerRideSettings}
                  state={{ cookie: cookie }}
                  sx={{ fontSize: "18px", marginRight: "30px" }}
                  className="Button"
                >
                  Settings
                </Button>
                <Button
                  color="inherit"
                  onClick={handleRideLogout}
                  to="/"
                  sx={{ fontSize: "18px" }}
                  className="Button"
                >
                  Logout
                </Button>
              </>
            )}
          {location.pathname.includes("driver") &&
            location.pathname.includes("ride") && (
              <>
                <Button
                  color="inherit"
                  onClick={handleDriverRideSettings}
                  state={{ cookie: cookie }}
                  sx={{ fontSize: "18px", marginRight: "30px" }}
                  className="Button"
                >
                  Settings
                </Button>
                <Button
                  color="inherit"
                  onClick={handleRideLogout}
                  to="/"
                  sx={{ fontSize: "18px" }}
                  className="Button"
                >
                  Logout
                </Button>
              </>
            )}
        </div>
      </Toolbar>
      <style jsx>{`
        @media (max-width: 600px) {
          div {
            flex-direction: column;
            align-items: center;
          }

          .Button {
            margin-bottom: 10px;
            margin-right: 0px;
          }
        }
      `}</style>
    </AppBar>
  );
}

export default Header;
