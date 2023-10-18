import React, { useState } from "react";
import { TextField, Button, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Autocomplete from "@mui/material/Autocomplete";
import Paper from "@mui/material/Paper";

const BasicInfo = (props) => {
  const roles = ["Passenger", "Driver"];
  const roleDB = ["ROLE_PASSENGER", "ROLE_DRIVER"];
  const genders = ["Male", "Female", "Other"];
  const types = ["SUV", "Sedan"];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [gender, setGender] = useState(genders[0]);
  const [dateOfBirth, setDateOfBirth] = useState();
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

  /*
  const oldData = props.oldData;
  console.log(oldData)
  if (Object.keys(oldData).length !== 0){
    setFirstName(oldData.firstName);
    setLastName(oldData.lastName);
    setEmail(oldData.email);
    setPhoneNumber(oldData.phone);
  }
  */

  function handleNext(event) {
    // TO-DO: Validation
    event.preventDefault();
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
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              fullWidth
              // required
            />
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              fullWidth
              //   required
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
              fullWidth
              //  required
              sx={{ mb: 4 }}
            />
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
              value={phone}
              fullWidth
              //    required
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
              renderInput={(params) => <TextField {...params} label="Gender" />}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={dateOfBirth}
                //    required
                onChange={(newValue) => setDateOfBirth(newValue)}
                sx={{ mb: 4 }}
              />
            </LocalizationProvider>
            <Autocomplete
              disablePortal
              //   required
              options={roles}
              sx={{ width: 300 }}
              onChange={(event, newValue) => {
                if (newValue == roles[0]) {
                  setRole(roleDB[0]);
                } else {
                  setRole(roleDB[1]);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="I'm a.." /> //Put required here
              )}
            />
          </Stack>
          <Stack spacing={2} direction="row" sx={{ marginBottom: 4 }}>
            <TextField
              type="text"
              variant="outlined"
              color="primary"
              label="Address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              //   required
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
              //    required
              sx={{ mb: 4 }}
            />
            <TextField
              type="zipcode"
              variant="outlined"
              color="primary"
              label="Zipcode"
              onChange={(e) => setZipCode(e.target.value)}
              value={zipcode}
              //  required
              sx={{ mb: 4 }}
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
                  sx={{ mb: 4 }}
                />
                <TextField
                  type="text"
                  variant="outlined"
                  color="primary"
                  label="License's Plate"
                  onChange={(e) => setLicensePlate(e.target.value)}
                  value={licensePlate}
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
                  value={year}
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
            // required
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
        </form>
        <small>
          Already have an account? <Link to="/">Login Here</Link>
        </small>
      </Paper>
    </div>
  );
};
export default BasicInfo;
