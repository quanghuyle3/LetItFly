import React from "react";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import "../css/Register.css";
import logo from "../mock_logo.jpg";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRole] = useState("ROLE_DRIVER");

  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hello");
    const newAccount = { name, email, password, roleName };
    fetch("http://localhost:8080/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAccount),
    }).then((response) => {
      response
        .text()
        .then((result) => {
          console.log(result);

          if (result === "SUCCESS") {
            navigate("/");
            console.log("Registration successful");
          } else if (result === "EXIST") {
            // User already exists
            // Display an error message to the user
            console.log("User already exists");
          } else {
            // Handle other response cases here
            console.log("Unhandled response:", result);
          }
        })
        .catch((error) => {
          console.error("Registration failed:", error);
          // Handle errors here, e.g., display an error message to the user
        });
    });
  };

  return (
    <div class="reg-box">
      <div>
        <img
          src={logo}
          alt="Let It FLy Logo"
        ></img>
      </div>
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <div class="input">
          <p>Name:</p>
          <input
            type="text"
            value={name}
            placeholder="Enter Full Name"
            onChange={handleNameChange}
            required
          ></input>

          <div class="input">
            <p>Email:</p>
            <input
              type="text"
              value={email}
              placeholder="Enter Email"
              onChange={handleEmailChange}
              required
            ></input>
          </div>
          <div class="input">
            <p>Password:</p>
            <input
              type="password"
              value={password}
              placeholder="Enter Password"
              onChange={handlePasswordChange}
              required
            ></input>
          </div>
          <div class="input">
            <p>Role:</p>
            <select
              name="roleName"
              onChange={handleRoleChange}
            >
              <option value="ROLE_DRIVER">Driver</option>
              <option value="ROLE_PASSENGER">Passenger</option>
            </select>
          </div>

          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
