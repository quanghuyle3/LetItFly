import React from 'react';
import logo from './mock_logo.jpg';
import { useState } from "react";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
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
              type="text"
              value={name}
              placeholder="Enter Username"
              onChange={handleUsernameChange}
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
