import React from "react";
import logo from "./mock_logo.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hello");
    const loginInfo = { email, password };
    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginInfo),
    }).then((response) => {
      response
        .text()
        .then((result) => {
          console.log(result);

          if (result === "SUCCESS") {
            navigate("/home");
            console.log("Login successful");
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
    <div class="login-page">
      <div>
        <img src={logo}></img>
      </div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div class="">
          <div class="input">
            <p>Username:</p>
            <input
              type="email"
              value={email}
              placeholder="Enter Username"
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
          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
