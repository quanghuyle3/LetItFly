import React from "react";
import logo from "../logo.png";
import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { isValidEmail, isValidPassword } from "../Forms/Validation";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import bg from "../mock-bg.jpg";
import { styled } from "@mui/system";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [failed, setFailed] = useState(0);
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("regSuccess") !== null) {
      let reg = JSON.parse(localStorage.getItem("regSuccess"));
      reg = reg.success;
      setRegSuccess(reg);
      localStorage.removeItem("regSuccess");
    }
    const timer = setTimeout(() => {
      setRegSuccess(false);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const navigate = useNavigate();
  function validation() {
    let isfailed = false;
    if (!isValidEmail(email)) {
      setEmailError(true);
      isfailed = true;
    } else {
      setEmailError(false);
    }
    if (!isValidPassword(password)) {
      isfailed = true;
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    return isfailed;
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (validation()) {
      return;
    }
    const loginInfo = { email, password };
    const proxy = process.env.REACT_APP_BACKEND_BASE_URL;

    try {
      const response = await fetch(`${proxy}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginInfo),
      });

      if (response.ok) {
        setFailed(0);
        const tokenObject = await response.json();
        if (tokenObject.roleName === "ROLE_DRIVER") {
          navigate("/driver", { state: { tokenObject } });
        } else {
          navigate("/customer", { state: { tokenObject } });
        }
      } else if (response.status === 401) {
        setFailed(1);
      } else if (response.status === 403) {
        setFailed(2);
      } else if (response.status === 423) {
        setFailed(3);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  const LoginButton = styled(Button)({
    backgroundColor: "orange",
    color: "white", // Set text color to white
    "&:hover": {
      backgroundColor: "#ed9b02", // Change hover color if needed
      color: "white", // Set text color to black
      border: "1px solid orange",
    },
  });

  const SignUpButton = styled(Button)({
    backgroundColor: "limegreen",
    color: "white", // Set text color to white
    "&:hover": {
      backgroundColor: "darkgreen", // Change hover color if needed
      color: "white", // Set text color to black
      // border: '1px solid orange',
    },
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: `url(${bg})`,
        backgroundSize: "cover",
        backdropFilter: "blur(8px)",
      }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          margin: "0 auto",
          maxWidth: "250px",
          minWidth: "30vw",
        }}
      >
        <img
          src={logo}
          style={{ maxWidth: "100%", height: "auto", display: "block" }}
        />

        {regSuccess === true && (
          <div>
            <Alert variant="filled" severity="success" sx={{ mb: 2, mt: 2 }}>
              Login Successful - Please Login Here!
            </Alert>
          </div>
        )}
        <h2 style={{ textAlign: "center" }}>Let us take care of your ride!</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            type="email"
            variant="outlined"
            color="primary"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            fullWidth
            error={emailError}
            helperText={
              emailError ? "Invalid Email (ex. john.smith@gmail.com)" : ""
            }
            required
            sx={{ marginBottom: 4 }}
          />
          <TextField
            type="password"
            variant="outlined"
            color="primary"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            error={passwordError}
            fullWidth
            helperText={
              passwordError
                ? "Password must: Be a minimum of 8 characters, contain at least one uppercase letter (A-Z), contain at least one lowercase letter (a-z), and at least one digit (0-9)."
                : ""
            }
            required
            sx={{ marginBottom: 4 }}
          />

          <LoginButton
            type="submit"
            style={{ display: "block", margin: "0 auto", width: "100%" }}
          >
            Login
          </LoginButton>

          <br></br>
          <hr></hr>
          <h5 style={{ textAlign: "center", marginBottom: "10px" }}>
            Don't have an account?
          </h5>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <SignUpButton
              type="button"
              style={{ display: "block", margin: "0 auto", width: "200px" }}
            >
              Create new account
            </SignUpButton>
          </Link>
          {failed === 1 && (
            <div>
              <Alert variant="filled" severity="error" sx={{ mb: 2, mt: 2 }}>
                Login Failed - Incorrect Email or Password!
              </Alert>
            </div>
          )}
          {failed === 2 && (
            <div>
              <Alert variant="filled" severity="error" sx={{ mb: 2, mt: 2 }}>
                Login Failed - Account is disabled!
              </Alert>
            </div>
          )}
          {failed === 3 && (
            <div>
              <Alert variant="filled" severity="error" sx={{ mb: 2, mt: 2 }}>
                Login Failed - Account is locked!
              </Alert>
            </div>
          )}
        </form>
      </Paper>
    </div>
  );
}

export default Login;
