import React, { useState } from "react";
import { TextField, Button, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CardInfo = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipCode] = useState("");
  const [useInfo, setUseInfo] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [exprDate, setExprDate] = useState();
  const [CVV, setCVV] = useState("");
  const [goPrev, setGoPrev] = useState(false);
  const navigate = useNavigate();
  const basicInfo = props.basicInfo;

  const changeUserInfo = (e) => {
    setUseInfo(e.target.checked);
    if (useInfo == false) {
      setFirstName(basicInfo.firstName);
      setLastName(basicInfo.lastName);
      setAddress(basicInfo.address);
      setState(basicInfo.state);
      setZipCode(basicInfo.zipcode);
    } else {
      setFirstName("");
      setLastName("");
      setAddress("");
      setState("");
      setZipCode("");
    }
  };

  function handlePrevious(event) {
    setGoPrev(true);
    props.prev();
  }

  function handleSubmit(event) {
    // TO-DO: Validation
    event.preventDefault();
    const basicInfo = props.basicInfo;
    const newAccount = {
      email: basicInfo.email,
      password: basicInfo.password,
      firstName: basicInfo.firstName,
      lastName: basicInfo.lastName,
      birthDate: basicInfo.birthDate,
      gender: basicInfo.gender,
      address: basicInfo.address + " " + basicInfo.state + " " + basicInfo.zipcode,
      phone: basicInfo.phone,
      dateJoin: null,
      driverLicense: basicInfo.driverLicense,
      roleName: basicInfo.roleName,
      cardNumber: cardNumber,
      expiration: exprDate,
      cvv: CVV,
      paymentType: "Credit",
      name: firstName + " " + lastName,
      billingAddress: address + state + zipcode,
      licensePlate: basicInfo.licensePlate,
      make: basicInfo.make,
      model: basicInfo.model,
      year: basicInfo.year,
      vehicleType: basicInfo.vehicleType,
    };
    fetch("http://localhost:8080/registration/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAccount),
    }).then((response) => {
      response
        .text()
        .then((newUser) => {
          console.log(response);
          if (response.status == 200) {
            console.log("Registration successful", newUser);
            if (basicInfo.roleName == "ROLE_DRIVER") {
              navigate("/driver");
            } else {
              navigate("/customer");
            }
           
          } 
        })
        .catch((error) => {
          console.error("Registration failed:", error);
        });
    });
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "goldenrod",
        backdropFilter: "blur(8px)",
      }}
    >
      <Paper
        elevation={3}
        style={{ padding: "20px", margin: "0 auto", maxWidth: "90vw" }}
      >
        <h2 style={{ textAlign: "center" }}>Sign Up</h2>
        <h3>Payment Information: </h3>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              fullWidth
              required={!goPrev}
            />
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              fullWidth
              required={!goPrev}
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 1 }}>
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="Address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              required={!goPrev}
              fullWidth
              sx={{ mb: 4 }}
            />
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="State"
              onChange={(e) => setState(e.target.value)}
              value={state}
              required={!goPrev}
              sx={{ mb: 4 }}
            />
            <TextField
              type="zipcode"
              variant="outlined"
              color="primary"
              label="Zipcode"
              onChange={(e) => setZipCode(e.target.value)}
              value={zipcode}
              required={!goPrev}
              sx={{ mb: 4 }}
            />
          </Stack>
          <FormControlLabel
            sx={{ marginBottom: 4 }}
            control={<Checkbox />}
            label="Use the same name and address information for card details."
            onChange={changeUserInfo}
          />
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="Card Number"
              onChange={(e) => setCardNumber(e.target.value)}
              value={cardNumber}
              required={!goPrev}
              sx={{ mb: 4 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="MM / YY"
                label="Expiration Date"
                value={exprDate}
                views={["month", "year"]}
                fullWidth
                onChange={(newValue) => setExprDate(newValue)}
                sx={{ mb: 4 }}
              />
            </LocalizationProvider>
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="CVV"
              onChange={(e) => setCVV(e.target.value)}
              value={CVV}
              required={!goPrev}
              sx={{ mb: 4 }}
            />
          </Stack>
          <Stack direction="row" sx={{ marginBottom: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              onClick={handlePrevious}
              style={{ display: "block", margin: "0 auto", width: "200px" }}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              color="primary"
              type="submit"
              style={{ display: "block", margin: "0 auto", width: "200px" }}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Paper>
    </div>
  );
};

export default CardInfo;
