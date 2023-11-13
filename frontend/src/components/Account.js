import "../css/Settings.css";
import Card from "./Card";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';
import { isValidPhoneNumber, isValidAddress } from "../Forms/Valdiation"

function Account({cookie}) {

    const [userInfo, setUserInfo] = useState(null);
    const [editPhone, setEditPhone] = useState(false);
    const [editAddress, setEditAddress] = useState(false);
    const [inputValueAddress, setInputValueAddress] = useState('');
    const [inputValuePhone, setInputValuePhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    
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

    const handleChangePhone = (event) => {
        setInputValuePhone(event.target.value); 
    }

    const handleChangeAddress = (event) => {
        setInputValueAddress(event.target.value); 
    }

    const handlePhone = () => {
        if(isValidPhoneNumber(inputValuePhone)) {
            var UserRequest = {
                email: userInfo.email,
                phone: inputValuePhone,
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
        }
        else
        {
            setPhoneError(true);
        }
    };

    const handleAddress = () => {
        if(isValidAddress(inputValueAddress)) { 
            var UserRequest = {
                email: userInfo.email,
                phone: userInfo.phone,
                address: inputValueAddress
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
        }
        else
        {
            setAddressError(true);
        }
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
                            <input type="text" onChange={handleChangePhone} placeholder={userInfo.phone}></input>
                            <button onClick={() => {setEditPhone(!editPhone); setPhoneError(false); setInputValuePhone('')}}>Cancel</button>
                            <button onClick={() => handlePhone()}>Submit</button>
                            {phoneError && <small>Invalid Phone</small>}
                        </div>): (
                        <div>
                            <p id="phone">{userInfo.phone}</p>
                            <button onClick={() => setEditPhone(!editPhone)}>Edit</button>
                        </div>)
                    }
    
                    <label for="address">Address:</label>
                    {editAddress ? (
                        <div>
                            <input type="text" onChange={handleChangeAddress} placeholder={userInfo.address}></input>
                            <button onClick={() => {setEditAddress(!editAddress); setAddressError(false); setInputValueAddress('')}}>Cancel</button>
                            <button onClick={() => handleAddress()}>Submit</button>
                            {addressError && <small>Invalid Address</small>}
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