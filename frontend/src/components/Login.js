import React from 'react';
import logo from './mock_logo.jpg';
import { useState } from "react";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  return (
  <div class="login-page">
    <div>
        <img src={logo}></img>
      </div>
    <h2>Login</h2>
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
      </div>
  </div>
  
  )
}

export default Login;
