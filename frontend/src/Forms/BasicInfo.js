import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, collapseClasses } from "@mui/material";
import { Link } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateValidationError } from "@mui/x-date-pickers";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import logo from "../mock_logo.jpg";
import dayjs from "dayjs";
import {
  isValidMake,
  isValidBirthday,
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
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [role, setRole] = useState(roles[0]);
  const [roleInDB, setRoleInDB] = useState(roleDB[0]);
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
  const [dateError, setDateError] = useState(null);
  const [addressError, setAddressError] = useState(false);
  const [zipCodeError, setZipCodeError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [driverLicenseError, setDriverLicenseError] = useState(false);
  const [licensePlateError, setlicensePlateError] = useState(false);
  const [makeError, setMakeError] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [yearError, setYearError] = useState(false);

  const errorMessage = React.useMemo(() => {
    switch (dateError) {
      case "minDate": {
        return "Invalid Date";
      }
      case "maxDate": {
        return "Must be at least 18 years old";
      }
      case "invalidDate": {
        return "Invalid Date: Must be at least 18 years old ";
      }
      case "dateRequired": {
        return "Date of Birth Required";
      }
      default: {
        return "";
      }
    }
  }, [dateError]);

  useEffect(() => {
    if (localStorage.getItem("oldData") != null) {
      const oldData = JSON.parse(localStorage.getItem("oldData"));
      setFirstName(oldData.firstName);
      setLastName(oldData.lastName);
      setEmail(oldData.email);
      setPhoneNumber(oldData.phone);
      setGender(oldData.gender);
      if (oldData.roleName == roles[0]) {
        handleRoleChange(roles[0]);
      } else if (oldData.roleName == roles[1]) {
        handleRoleChange(roles[1]);
      }

      setDateOfBirth(dayjs(oldData.birthDate, "YYYY-MM-DD"));
      setAddress(oldData.address);
      setState(oldData.state);
      setZipCode(oldData.zipcode);
      setPassword(oldData.password);
    }
  }, []);

  function validation() {
    let isfailed = false;
    if (!isValidName(firstName)) {
      isfailed = true;
      setFirstNameError(true);
    } else {
      setFirstNameError(false);
    }
    if (!isValidName(lastName)) {
      isfailed = true;
      setLastNameError(true);
    } else {
      setLastNameError(false);
    }
    if (!isValidEmail(email)) {
      isfailed = true;
      setEmailError(true);
    } else {
      setEmailError(false);
    }

    if (!isValidBirthday(dateOfBirth)) {
      isfailed = true;
      if (dateOfBirth === null) {
        setDateError("dateRequired");
      } else if (dateOfBirth !== null) {
        setDateError("invalidDate");
      }
    } else {
      setDateError(false);
    }
    console.log(dateError);
    console.log(dateOfBirth);
    if (!isValidPhoneNumber(phone)) {
      isfailed = true;
      setPhoneError(true);
    } else {
      setPhoneError(false);
    }
    if (!isValidAddress(address)) {
      isfailed = true;
      setAddressError(true);
    } else {
      setAddressError(false);
    }
    if (!isValidZipCode(zipcode)) {
      isfailed = true;
      setZipCodeError(true);
    } else {
      setZipCodeError(false);
    }
    if (!isValidPassword(password)) {
      isfailed = true;
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    if (roleInDB == roleDB[1]) {
      if (!isValidDriverLicense(driverL)) {
        isfailed = true;
        setDriverLicenseError(true);
      } else {
        setDriverLicenseError(false);
      }
      if (!isValidLicensePlate(licensePlate)) {
        isfailed = true;
        setlicensePlateError(licensePlate);
      } else {
        setlicensePlateError(false);
      }
      if (!isValidMake(make)) {
        isfailed = true;
        setMakeError(true);
      } else {
        setMakeError(false);
      }
      if (!isValidModel(model)) {
        isfailed = true;
        setModelError(true);
      } else {
        setModelError(false);
      }
      if (!isValidCarYear(year)) {
        isfailed = true;
        setYearError(true);
      } else {
        setYearError(false);
      }
    }
    return isfailed;
  }

  function handleRoleChange(event, newValue) {
    if (newValue === null) {
      setRole(roles[0]);
      setRoleInDB(roleDB[0]);
    } else if (newValue === roles[0]) {
      setRole(roles[0]);
      setRoleInDB(roleDB[0]);
    } else {
      setRole(roles[1]);
      setRoleInDB(roleDB[1]);
    }
  }

  function handleNext(event) {
    event.preventDefault();
    setFailed(0);
    let isfail = validation();
    console.log(isfail);
    if (isfail) {
      console.log("hello");
      setFailed(3);
      return;
    }
    if (email != "") {
      fetch(`http://localhost:8080/api/check/email?email=${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        response.text().then((message) => {
          if (message == "EXIST") {
            console.log("here email check");
            setFailed(1);
            return;
          }
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
          if (message == "EXIST") {
            setFailed(2);
            return;
          }
        });
      });
    }
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
          roleName: roleInDB,
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
        <Grid container justifyContent="center" alignItems="center">
          <Grid item>
            <img src={logo} style={{ height: "100px" }} />
          </Grid>
        </Grid>
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
              helperText={firstNameError ? "Invalid First Name (ex. John)" : ""}
              value={firstName}
              fullWidth
              required
            />
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="Last Name"
              helperText={lastNameError ? "Invalid Last Name (ex. Smith)" : ""}
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
              helperText={
                emailError ? "Invalid Email (ex. john.smith@gmail.com)" : ""
              }
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
              helperText={
                phoneError ? "Invalid Phone Number: Must have 10 digits" : ""
              }
              value={phone}
              fullWidth
              required
              sx={{ mb: 4 }}
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <Autocomplete
              disablePortal
              value={gender}
              options={genders}
              sx={{ width: 400 }}
              onChange={(event, newValue) => {
                setGender(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Gender" required />
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth*"
                value={dateOfBirth}
                onChange={(newValue) => setDateOfBirth(newValue)}
                onError={(newError) => setDateError(newError)}
                slotProps={{
                  textField: {
                    helperText: errorMessage,
                  },
                }}
                minDate={dayjs().subtract(115, "year")}
                maxDate={dayjs().subtract(18, "year")}
                sx={{ mb: 4 }}
              />
            </LocalizationProvider>
            <Autocomplete
              disablePortal
              required
              value={role}
              options={roles}
              sx={{ width: 300 }}
              onChange={handleRoleChange}
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
              helperText={addressError ? "Invalid Address" : ""}
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
              helperText={zipCodeError ? "Invalid Zipcode" : ""}
              onChange={(e) => setZipCode(e.target.value)}
              value={zipcode}
              error={zipCodeError}
              sx={{ mb: 4 }}
              required
            />
          </Stack>
          <TextField
            type="password"
            variant="outlined"
            color="primary"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            error={passwordError}
            helperText={
              "Password must: Be a minimum of 8 characters, contain at least one uppercase letter (A-Z), contain at least one lowercase letter (a-z), and at least one digit (0-9)."
            }
            required
            fullWidth
            sx={{ mb: 4 }}
          />

          {roleInDB === roleDB[1] && (
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
                  helperText={
                    driverLicenseError ? "Invalid Driver License" : ""
                  }
                  required
                  fullWidth
                  error={driverLicenseError}
                  sx={{ mb: 4 }}
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="License Plate"
                  onChange={(e) => setLicensePlate(e.target.value)}
                  value={licensePlate}
                  helperText={licensePlateError ? "Invalid License Plate" : ""}
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
                  helperText={
                    makeError ? "Invalid Make of Car (ex. Nissan)" : ""
                  }
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
                  helperText={modelError ? "Invalid Model of Car" : ""}
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
                  helperText={yearError ? "Must be within 50 years" : ""}
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
