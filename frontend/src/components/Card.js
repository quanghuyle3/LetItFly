import "../css/Settings.css";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';

function Card(param) {
    const [userInfo, setUserInfo] = useState(null);
    const num = Number(param.number);
    const cookie = param.cookie;

    useEffect(() => {
        fetch(`http://localhost:8080/api/payment/findByUserId?userId=${cookie.id}`, {
        headers: { "Content-Type": "application/json",
        "Authorization": "Bearer " + cookie.token}
        }).then((response) => {
            response.json().then((jsonObject) => {
                setUserInfo(jsonObject);
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
                    <h3>Card: {num+1} </h3> 
                    <label for="name">Name:</label> 
                    <p id="name">{userInfo[num].name}</p>
                    <label for="number">Number:</label> 
                    <p id="number">{"************" + userInfo[num].cardNumber.substring(12,16)}</p>
                    <label for="type">Type:</label> 
                    <p id="type">{userInfo[num].type}</p>
                    <label for="exp">Expiration:</label> 
                    <p id="exp">{userInfo[num].expiration}</p>
                    <label for="address">Billing Address:</label> 
                    <p id="address">{userInfo[num].billingAddress}</p>
                    <button onClick={handleDel}>Delete Card</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}  
        </div>
    );
}
export default Card