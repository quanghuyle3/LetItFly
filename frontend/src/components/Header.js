import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import logo from "../logo.png";
import { alignProperty } from "@mui/material/styles/cssUtils";

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
              height="60px"
              width="auto"
              maxWidth="30%"
            />
          </Link>
        </Typography>

        <div
          style={{
            display: "flex",
            alignItems: "left",
            color:"black",
            
          }}
        >
          <Button
            color="inherit"
            
            component={Link}
            to="/customer/settings"
            state={{ cookie: cookie }}
            sx = {{marginRight: '30px', fontSize: '18px'}}
          >
            Settings
          </Button>

          <Button color="inherit" component={Link} to="/" sx={{ fontSize: '18px'}} >
            Logout
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
/*

 <div className="header">
  <nav>
    <a>
      <Link
        to={cookie.roleName === "ROLE_DRIVER" ? "/driver" : "/customer"}
        state={{ tokenObject: cookie }}
      >
        <img
          className="header-left"
          src={logo}
          alt="Let It Fly Logo"
          height={100}
        />
      </Link>
    </a>
    <div className="header-right">
      <p className="header-username">
        {cookie.email ? `Hi ${cookie.firstName}!` : "Hi username!"}
      </p>
      <div class="rightSection">
       
        <a class="links">
          <Link to={"/"}>Logout</Link>
        </a>
        <a class="links">
          <Link
            to={{
              pathname: "/customer/settings",
            }}
            state={{ cookie: cookie }}
          >
            Settings
          </Link>
        </a>
      </div>
    </div>
  </nav>
</div>
*/
