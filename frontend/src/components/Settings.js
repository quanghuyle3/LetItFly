import "../css/Settings.css";
import { Fragment, useEffect } from "react";

function Settings() {
    /*useEffect(() => {
        fetch("http://localhost:8080/api/findUserByEmail?email=driveraccount3@gmail.com", {
        headers: { "Content-Type": "application/json" },
        mode: 'no-cors'
    }).then((response) => {response.json()})
    }, [])*/

    fetch("http://localhost:8080/api/findUserByEmail?email=driveraccount3@gmail.com", {
        headers: { "Content-Type": "application/json" },
        mode: 'no-cors'
    }).then((response) => {response.json()})
    return (
        <Fragment>
            <div class="row">
                <h1>Settings:</h1>
                <label for="fname">First name: </label>
                <input type="text" placeholder="Fname"></input>
                <button type="submit">Submit</button>
                <label for="lname">Last name: </label>
                <input type="text" id="lname" placeholder="Lname"></input>
                <button type="submit">Submit</button>
                <label for="email">E-mail: </label>
                <input type="text" id="email" placeholder="Email"></input>
                <button type="submit">Submit</button>
            </div>
        </Fragment>
    );
    
}

export default Settings;