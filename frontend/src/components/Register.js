import React from "react";
import { Link } from "react-router-dom";

import { useState } from "react";
import "./Register.css";
import logo from "./mock_logo.jpg";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRole] = useState("ROLE_DRIVER");

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
    }).then(() => {
      console.log(newAccount);
    });
  };
  return (
    <div class="reg-box">
      <div>
        <img src={logo}></img>
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
            <select name="roleName" onChange={handleRoleChange}>
              <option value="ROLE_DRIVER">Driver</option>
              <option value="ROLE_PASSENGER">Passenger</option>
            </select>
          </div>

          <button type="submit">Create Account</button>
          <p>{name}</p>
          <p>{roleName}</p>
        </div>
      </form>
    </div>
  );
}

export default Register;
