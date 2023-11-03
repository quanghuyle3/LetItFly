import "../css/Settings.css";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';

function Account({cookie}) {

    const [userInfo, setUserInfo] = useState(null);
    
    useEffect(() => {
        fetch(`http://localhost:8080/api/user/findByEmail?email=${cookie.email}`, {
        headers: { "Content-Type": "application/json" },
        "Authorization": "Bearer " + cookie.token
        }).then((response) => {
            response.json().then((jsonObject) => {
                setUserInfo(JSON.parse(JSON.stringify(jsonObject)));
            })
        })
    }, []);
    
    const handleAddress = () => {
        alert("change address");
        /*
        const newAddress = prompt("Enter new Address: ");
        var UserRequest = {
            email: userInfo.email,
            phone: userInfo.phone,
            address: newAddress
        };

        fetch("http://localhost:8080/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(UserRequest)
        }).then((response) => {
            window.location.reload();
            alert("Update Successfull");
        }).catch((error) => {
            console.error("Update failed:", error);
        });
        */
    };

    const handlePhone = () => {
        alert("change Phone");
        /*
        const newPhone = prompt("Enter new Phone: ");
        var UserRequest = {
            email: userInfo.email,
            phone: newPhone,
            address: userInfo.address
        };

        fetch("http://localhost:8080/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(UserRequest)
        }).then((response) => {
            window.location.reload();
            alert("Update Successfull");
        }).catch((error) => {
            console.error("Update failed:", error);
        }); 
        */   
    };

    return (
        <div className="row">
            {userInfo !== null ? ( 
                <div>
                    <h1>Account: </h1>  
                    <p>First Name: {userInfo.firstName}</p>
                    <p>Last Name: {userInfo.lastName}</p>
                    <p>Email: {userInfo.email}</p>
                    <p>Phone: {userInfo.phone}</p>
                    <p>Address: {userInfo.address}</p>
                    <button onClick={handleAddress}>Change Address</button>
                    <button onClick={handlePhone}>Change Phone</button>  
                </div>
            ) : (
                <p>Loading...</p>
            )}  
        </div>
    );
}
export default Account;