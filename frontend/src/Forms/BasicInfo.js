import React, { useState } from "react";
import { TextField, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import dayjs from "dayjs";
import {
  isValidMake,
  isValidPassword,
  isValidZipCode,
  isValidAddress,
  isValidEmail,
  isValidName,
  isValidPhoneNumber,
  isValidDriverLicense,
  isValidLicensePlate,
  isValidModel,
  isValidCarYear,
} from "./Valdiation";
import { roles, roleDB, genders, types, stateAcronyms } from "./Categories";

const BasicInfo = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [gender, setGender] = useState(genders[0]);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [role, setRole] = useState(roles[0]);
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipCode] = useState("");
  const [password, setPassword] = useState("");
  const [driverL, setDriverL] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("");
  const [failed, setFailed] = useState(0);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [zipCodeError, setZipCodeError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [driverLicenseError, setDriverLicenseError] = useState(false);
  const [licensePlateError, setlicensePlateError] = useState(false);
  const [makeError, setMakeError] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [yearError, setYearError] = useState(false);

  /*
  const oldData = props.oldData;
  console.log(oldData)
  if (Object.keys(oldData).length !== 0){
    setFirstName(oldData.firstName);
    setLastName(oldData.lastName);
    setEmail(oldData.email);
    //setPhoneNumber(oldData.phone);
  
  */

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
    }else {
      isfailed = false;
      setLastNameError(false);
    }
    if (!isValidEmail(email)) {
      setEmailError(true);
      isfailed = true;
    } else {
      isfailed = false;
      setEmailError(false);
    }
    if(!dateOfBirth) {
      isfailed = true;
      setDateError(true);
    } else {
      isfailed = false;
      setDateError(false);
    }
    if (!isValidPhoneNumber(phone)) {
      isfailed = true;
      setPhoneError(true);
    } else {
      isfailed = false;
      setPhoneError(false);
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
    if (!isValidPassword(password)) {
      isfailed = true;
      setPasswordError(true);
    } else {
      isfailed = false;
      setPasswordError(false);
    }
    if (role == roleDB[1]) {
      if (!isValidDriverLicense(driverL)) {
        isfailed = true;
        setDriverLicenseError(true);
      } else {
        isfailed = false;
        setDriverLicenseError(false);
      }
      if (!isValidLicensePlate(licensePlate)) {
        isfailed = true;
        setlicensePlateError(licensePlate);
      } else {
        isfailed = false;
        setlicensePlateError(false);
      }
      if (!isValidMake(make)) {
        isfailed = true;
        setMakeError(true);
      } else {
        isfailed = false;
        setMakeError(false);
      }
      if (!isValidModel(model)) {
        isfailed = true;
        setModelError(true);
      } else {
        isfailed = false;
        setModelError(false);
      }
      if (!isValidCarYear(year)) {
        isfailed = true;
        setYearError(true);
      } else {
        isfailed = false;
        setYearError(false);
      }
    }
    return isfailed;
  }

  function handleNext(event) {
    event.preventDefault();
    /*
    if (email != "") {
      fetch(`http://localhost:8080/api/check/email?email=${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        response.text().then((message) => {
          setFailed(1);
        });
      });
    }
    if (role == roleDB[1]) {
      fetch(
        `http://localhost:8080/api/check/driverLicense?driverLicense=${driverL}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      ).then((response) => {
        response.text().then((message) => {
          setFailed(2);
        });
      });
    }
    */
    if (failed == 3 || failed == 0) {
      let isfail = validation();
      if (isfail) {
        setFailed(3);
        return;
      } else {
        setFailed(0);
        let basicInfoObj = {
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          birthDate: dateOfBirth,
          gender: gender,
          address: address,
          state: state,
          zipcode: zipcode,
          phone: phone,
          roleName: role,
          dateJoin: null,
          driverLicense: driverL,
          licensePlate: licensePlate,
          make: make,
          year: year,
          vehicleType: type,
        };
        console.log("Basic Info: " + basicInfoObj);
        props.getData(basicInfoObj);
      }
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
      }}
    >
      <Paper
        elevation={3}
        style={{ padding: "20px", margin: "0 auto", maxWidth: "90vw" }}
      >
        <h2 style={{ textAlign: "center" }}>Sign Up</h2>
        <h3>Personal Information: </h3>
        <form onSubmit={handleNext}>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="First Name"
              onChange={(e) => {
                setFirstNameError(false);
                setFirstName(e.target.value);
              }}
              error={firstNameError}
              value={firstName}
              fullWidth
              required
            />
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={lastNameError}
              fullWidth
              required
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              type="email"
              variant="outlined"
              color="primary"
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              error={emailError}
              fullWidth
              required
              sx={{ mb: 4 }}
            />
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={phoneError}
              helperText={phoneError ? "Need 10 digits" : ""}
              value={phone}
              fullWidth
              required
              sx={{ mb: 4 }}
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <Autocomplete
              disablePortal
              options={genders}
              sx={{ width: 300 }}
              onChange={(event, newValue) => {
                setGender(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Gender" required />
              )}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={dateOfBirth}
                minDate={dayjs().subtract(150, "year")}
                maxDate={dayjs()}
                error={dateError}
                onChange={(newValue) => setDateOfBirth(newValue)}
                sx={{ mb: 4 }}
              />
            </LocalizationProvider>
            <Autocomplete
              disablePortal
              required
              options={roles}
              sx={{ width: 300 }}
              onChange={(event, newValue) => {
                if (newValue === null) {
                  setRole(roles[0]);
                } else if (newValue === roles[0]) {
                  setRole(roleDB[0]);
                } else {
                  setRole(roleDB[1]);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="I'm a.." required />
              )}
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              required
              type="text"
              variant="outlined"
              color="primary"
              label="Address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              error={addressError}
              fullWidth
              sx={{ mb: 4 }}
            />
            <Autocomplete
              disablePortal
              required
              value={state}
              options={stateAcronyms}
              sx={{ width: 300 }}
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
              sx={{ mb: 4 }}
              required
            />
          </Stack>

          {role === roleDB[1] && (
            <div>
              <h3>Driver and Vechile Information:</h3>
              <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Driver's License"
                  onChange={(e) => setDriverL(e.target.value)}
                  value={driverL}
                  required
                  fullWidth
                  error={driverLicenseError}
                  sx={{ mb: 4 }}
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="License's Plate"
                  onChange={(e) => setLicensePlate(e.target.value)}
                  value={licensePlate}
                  error={licensePlateError}
                  required
                  fullWidth
                  sx={{ mb: 4 }}
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Make"
                  onChange={(e) => setMake(e.target.value)}
                  value={make}
                  error={makeError}
                  required
                  fullWidth
                  sx={{ mb: 4 }}
                />
              </Stack>
              <Stack spacing={2} direction="row" sx={{ marginBottom: 6 }}>
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="Model"
                  onChange={(e) => setModel(e.target.value)}
                  value={model}
                  error={modelError}
                  required
                  fullWidth
                  sx={{ mb: 4 }}
                />
                <TextField
                  type="number"
                  variant="outlined"
                  color="primary"
                  label="Year"
                  onChange={(e) => setYear(e.target.value)}
                  helperText={yearError ? "Within 50 years" : ""}
                  value={year}
                  error={yearError}
                  required
                  sx={{ mb: 4 }}
                />
                <Autocomplete
                  disablePortal
                  required
                  options={types}
                  sx={{ width: 300 }}
                  onChange={(event, newValue) => {
                    setType(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Type of Car" required />
                  )}
                />
              </Stack>
            </div>
          )}

          <TextField
            type="password"
            variant="outlined"
            color="primary"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            error={passwordError}
            required
            fullWidth
            sx={{ mb: 4 }}
          />
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            style={{ display: "block", margin: "0 auto", width: "200px" }}
          >
            Next
          </Button>
          {failed === 1 && (
            <div>
              <Alert
                onClose={() => {}}
                variant="filled"
                severity="error"
                sx={{ mb: 2, mt: 2 }}
              >
                Registration error - Email already exsits!
              </Alert>
            </div>
          )}
          {failed === 2 && (
            <div>
              <Alert
                onClose={() => {}}
                variant="filled"
                severity="error"
                sx={{ mb: 2, mt: 2 }}
              >
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
        <small>
          Already have an account? <Link to="/">Login Here</Link>
        </small>
      </Paper>
    </div>
  );
};
export default BasicInfo;
