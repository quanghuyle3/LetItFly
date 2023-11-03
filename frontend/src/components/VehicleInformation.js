import "../css/Settings.css";
import Vehicle from "../components/Vehicle";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';

function VehicleInformation({cookie}) {

    const [userInfo, setUserInfo] = useState(null);
    const vehics = [];

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

    if(userInfo !== null) {
        for(let i = 0; i < userInfo.length; i++) {
            vehics.push(i);
        }
    }

    const handleAdd = () => {
        alert("Add");
    };

    return (
        <div className="row">
            {userInfo !== null ? ( 
                <div>
                    <h1>Vehicle Information:</h1>
                    <button onClick={handleAdd}>Add Vehicle</button>
                    {vehics.map((number) => (<Vehicle key={number} number={number} cookie={cookie}/>))}
                </div>
            ) : (
                <p>Loading...</p>
            )}  
        </div>
    );
}
export default VehicleInformation;