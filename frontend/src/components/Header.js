import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "../mock_logo.jpg";
import "../css/Home.css";

function Header() {
  return (
    <header>
      <Nav>
        <Link to={"/"}>
          <img
            src={logo}
            alt="Let It Fly Logo"
            height={100}
          />
        </Link>
        <ul className="navbar-home">
          <Link to={"/register"}>
            <li>Settings</li>
          </Link>
          <Link to={"/"}>
            <li>Logout</li>
          </Link>
        </ul>
      </Nav>
    </header>
  );
}

const Nav = styled.div`
  display: flex;
  outline: 10px solid blue;
  justify-content: center;
`;

export default Header;
