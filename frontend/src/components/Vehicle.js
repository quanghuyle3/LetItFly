import "../css/Settings.css";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';

function Vehicle(param) {

    const [userInfo, setUserInfo] = useState(null);
    const num = Number(param.number);
    const cookie = param.cookie; 

    useEffect(() => {
        fetch(`http://localhost:8080/api/vehicle/findByUserId?userId=${cookie.id}`, {
        headers: { "Content-Type": "application/json" },
        "Authorization": "Bearer " + cookie.token
        }).then((response) => {
            response.json().then((jsonObject) => {
                setUserInfo(JSON.parse(JSON.stringify(jsonObject)));
            })
        })
    }, []);

    const handleDel = () => {
        alert("delete");
    };

    return (
        <div className="row">
            {userInfo !== null ? ( 
                <div>
                    <h3>Vehicle {num+1}: </h3>  
                    <p>License Plate: {userInfo[num].licensePlate}</p>
                    <p>Make: {userInfo[num].make}</p>
                    <p>Model: {userInfo[num].model}</p>
                    <p>Year: {userInfo[num].year}</p>
                    <p>Type: {userInfo[num].type}</p>
                    <button onClick={handleDel}>Delete Vehicle</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}  
        </div>
    );
}
export default Vehicle;