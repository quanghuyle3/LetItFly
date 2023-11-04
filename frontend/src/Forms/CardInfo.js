import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import Alert from "@mui/material/Alert";
import { stateAcronyms } from "./Categories";
import dayjs from "dayjs";
import {
  isValidZipCode,
  isValidAddress,
  isValidName,
  isValidCVV,
  isValidCard,
} from "./Valdiation";

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
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [zipCodeError, setZipCodeError] = useState(false);
  const [cardNumberError, setCardNumberError] = useState(false);
  const [cvvError, setCVVError] = useState(false);
  const [failed, setFailed] = useState(0);
  const navigate = useNavigate();
  const basicInfo = props.basicInfo;

  const changeUserInfo = (e) => {
    setUseInfo(e.target.checked);
    if (useInfo === false) {
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

  function validation() {
    let isfailed = false;
    if (!isValidName(firstName)) {
      setFirstNameError(true);
      isfailed = true;
    } else {
      isfailed = false;
      setFirstNameError(false);
    }
    if (!isValidName(lastName)) {
      setLastNameError(true);
      isfailed = true;
    } else {
      isfailed = false;
      setLastNameError(false);
    }
    if (!isValidAddress(address)) {
      isfailed = true;
      setAddressError(true);
    } else {
      isfailed = false;
      setAddressError(false);
    }
    if (!isValidZipCode(zipcode)) {
      isfailed = true;
      setZipCodeError(true);
    } else {
      isfailed = false;
      setZipCodeError(false);
    }
    if (!isValidCard(cardNumber)) {
      isfailed = true;
      setCardNumberError(cardNumber);
    } else {
      isfailed = false;
      setCardNumberError(false);
    }
    if (!isValidCVV(CVV)) {
      isfailed = true;
      setCVVError(CVV);
    } else {
      isfailed = false;
      setCVVError(false);
    }
    return isfailed;
  }

  function handleSubmit(event) {
    event.preventDefault();
    let isfail = validation();
    if (isfail) {
      setFailed(3);
      return;
    } else {
      const basicInfo = props.basicInfo;
      const newAccount = {
        email: basicInfo.email,
        password: basicInfo.password,
        firstName: basicInfo.firstName,
        lastName: basicInfo.lastName,
        birthDate: (basicInfo.birthDate).format("MM/DD/YYYY"),
        gender: basicInfo.gender,
        address:
          basicInfo.address + " " + basicInfo.state + " " + basicInfo.zipcode,
        phone: basicInfo.phone,
        dateJoin: dayjs().format("MM/DD/YYYY"),
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
      console.log(newAccount);
      fetch("http://localhost:8080/registration/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccount),
      }).then((response) => {
        response
          .text()
          .then((newUser) => {
            console.log(response);
            if (response.status === 200) {
              console.log("Registration successful", newUser);
              basicInfo.roleName === "ROLE_DRIVER"
                ? navigate("/driver")
                : navigate("/customer");
            } else if (response.status === 302) {
              console.log(
                "Registration failed: Email already exists.",
                newUser
              );
              setFailed(1);
            } else if (response.status === 323) {
              console.log(
                "Registration failed: Driver License already exist.",
                newUser
              );
              setFailed(2);
            }
          })
          .catch((error) => {
            console.error("Registration failed: ", error);
          });
      });
    }
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
              error={firstNameError}
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
              error={lastNameError}
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
              error={addressError}
              fullWidth
              sx={{ mb: 4 }}
            />
            <Autocomplete
              disablePortal
              required
              value={state}
              options={stateAcronyms}
              sx={{ width: 200 }}
              onChange={(event, newValue) => {
                setState(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="State" />}
            />
            <TextField
              type="zipcode"
              variant="outlined"
              color="primary"
              label="Zipcode"
              onChange={(e) => setZipCode(e.target.value)}
              value={zipcode}
              error={zipCodeError}
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
              error={cardNumberError}
              required={!goPrev}
              sx={{ mb: 4 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="MM / YY"
                label="Expiration Date"
                value={exprDate}
                minDate={dayjs()}
                views={["month", "year"]}
                onChange={(newValue) => setExprDate(newValue)}
                sx={{ mb: 4 }}
              />
            </LocalizationProvider>
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="CVV"
              error={cvvError}
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
          {failed === 1 && (
            <div>
              <Alert variant="filled" severity="error">
                Registration error - Email already exsits!
              </Alert>
            </div>
          )}
          {failed === 2 && (
            <div>
              <Alert variant="filled" severity="error">
                Registration error - Driver Licenses already exsits!
              </Alert>
            </div>
          )}
          {failed === 3 && (
            <div>
              <Alert
                onClose={() => {}}
                variant="filled"
                severity="error"
                sx={{ mb: 2, mt: 2 }}
              >
                Registration error - Incorrect Field!
              </Alert>
            </div>
          )}
        </form>
      </Paper>
    </div>
  );
};

export default CardInfo;
