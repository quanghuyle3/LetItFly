import "../css/Settings.css";
import Card from "../components/Card";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';

function Payment({cookie}) {

    const [userInfo, setUserInfo] = useState(null);
    const cards = []; 

    useEffect(() => {
        fetch(`http://localhost:8080/api/payment/findByUserId?userId=${cookie.id}`, {
        headers: { "Content-Type": "application/json" },
        "Authorization": "Bearer " + cookie.token
        }).then((response) => {
            response.json().then((jsonObject) => {
                setUserInfo(jsonObject);
            })
        })
    }, []);

    if(userInfo !== null) {
        for(let i = 0; i < userInfo.length; i++) {
            cards.push(i);
        }
    }

    const handleAdd = () => {
        alert("Add");
    };

    return (
        <div className="row">
            {userInfo !== null ? ( 
                <div>
                    <h1>Payment Information: </h1>
                    <button onClick={handleAdd}>Add Card</button>
                    {cards.map((number) => (<Card key={number} number={number} cookie={cookie}/>))}
                </div>
            ) : (
                <p>Loading...</p>
            )}  
        </div>
    );
}
export default Payment