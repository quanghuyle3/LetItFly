import "../css/Settings.css";
import Card from "./Card";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';

function Account({cookie}) {

    const [userInfo, setUserInfo] = useState(null);
    const [editPhone, setEditPhone] = useState(false);
    const [editAddress, setEditAddress] = useState(false);
    const [inputValue, setInputValue] = useState('');
    
    useEffect(() => {
        fetch(`http://localhost:8080/api/user/findByEmail?email=${cookie.email}`, {
        headers: { "Content-Type": "application/json",
        "Authorization": "Bearer " + cookie.token }
        }).then((response) => {
            response.json().then((jsonObject) => {
                setUserInfo(JSON.parse(JSON.stringify(jsonObject)));
            })
        })
    }, []);

    const handleChange = (event) => {
        setInputValue(event.target.value); 
    }

    const handlePhone = () => {
        var UserRequest = {
            email: userInfo.email,
            phone: inputValue,
            address: userInfo.address
        };

        fetch("http://localhost:8080/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
        "Authorization": "Bearer " + cookie.token},
        body: JSON.stringify(UserRequest)
        }).then((response) => {
            alert("Update Successful");
            window.location.reload(); 
        }).catch((error) => {
            console.error("Update failed:", error);
        });  
    };

    const handleAddress = () => {
        var UserRequest = {
            email: userInfo.email,
            phone: userInfo.phone,
            address: inputValue
        };

        fetch("http://localhost:8080/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json", 
        "Authorization": "Bearer " + cookie.token},
        body: JSON.stringify(UserRequest)
        }).then((response) => {
            window.location.reload();
            alert("Update Successfull");
        }).catch((error) => {
            console.error("Update failed:", error);
        }); 
    };

    return (
        <div className="row">
            {userInfo !== null ? ( 
                <div>
                    <h1>Account: </h1> 
                    <label for="fname">First Name:</label>
                    <p id="fname">{userInfo.firstName}</p>
                    <label for="lname">Last Name:</label>
                    <p id="lname">{userInfo.lastName}</p>
                    <label for="email">Email:</label>
                    <p id="email">{userInfo.email}</p>

                    <label for="phone">Phone:</label>
                    {editPhone ? (
                        <div>
                            <input type="text" onChange={handleChange} placeHolder={userInfo.phone}></input>
                            <button onClick={() => setEditPhone(!editPhone)}>Cancel</button>
                            <button onClick={() => handlePhone()}>Submit</button>
                        </div>): (
                        <div>
                            <p id="phone">{userInfo.phone}</p>
                            <button onClick={() => setEditPhone(!editPhone)}>Edit</button>
                        </div>)
                    }
    
                    <label for="address">Address:</label>
                    {editAddress ? (
                        <div>
                            <input type="text" onChange={handleChange} placeHolder={userInfo.address}></input>
                            <button onClick={() => setEditAddress(!editAddress)}>Cancel</button>
                            <button onClick={() => handleAddress()}>Submit</button>
                        </div>): (
                        <div>
                            <p id="address">{userInfo.address}</p>
                            <button onClick={() => setEditAddress(!editAddress)}>Edit</button>
                        </div>)
                    }
                </div>
            ) : (
                <p>Loading...</p>
            )}  
        </div>
    );
}
export default Account;