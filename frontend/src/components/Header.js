import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import logo from "../logo.png";

function Header({ cookie }) {
  return (
    <AppBar position="static" sx={{ bgcolor: "#fbeddb", overflow: "hidden" }}>
      <Toolbar>
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

        <div
          style={{
            display: "flex",
            alignItems: "left",
            color: "black",
          }}
        >
          <Button
            color="inherit"
            component={Link}
            to="/customer/settings"
            state={{ cookie: cookie }}
            sx={{ fontSize: "18px", marginRight: "30px"}}
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
