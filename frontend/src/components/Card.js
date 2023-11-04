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
                    <p>Card Number: {"************" + userInfo[num].cardNumber.substring(12,16)}</p>
                    <p>Card Name: {userInfo[num].name}</p>
                    <p>type: {userInfo[num].type}</p>
                    <p>BillingAddress: {userInfo[num].billingAddress}</p>
                    <button onClick={handleDel}>Delete Card</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}  
        </div>
    );
}
export default Card