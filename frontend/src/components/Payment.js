import "../css/Settings.css";
import Card from "../components/Card";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';

function Payment({cookie}) {

    const [userInfo, setUserInfo] = useState(null);
    const [editCard, setEditCard] = useState(false);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [type, setType] = useState('');
    const [exp, setExp] = useState('');
    const [cvv, setCvv] = useState('');
    const [billing, setBilling] = useState('');
    const cards = []; 

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

    const changeName = (event) => {
        setName(event.target.value); 
    }

    const changeNumber = (event) => {
        setNumber(event.target.value); 
    }

    const changeType = (event) => {
        setType(event.target.value); 
    }

    const changeExp = (event) => {
        setExp(event.target.value); 
    }

    const changeCvv = (event) => {
        setCvv(event.target.value); 
    }

    const changeBilling = (event) => {
        setBilling(event.target.value); 
    }

    if(userInfo !== null) {
        for(let i = 0; i < userInfo.length; i++) {
            cards.push(i);
        }
    }

    const handleAdd = () => {
        alert(name + number + exp + cvv + billing);
    };

    return (
        <div className="row">
            {userInfo !== null ? ( 
                <div>
                    <h1>Payment Information: </h1>
                    {editCard ? (
                        <div>
                            <input type="text" onChange={changeName} placeHolder="name"></input>
                            <input type="text" onChange={changeNumber}placeHolder="card number"></input>
                            <input type="text" onChange={changeType} placeHolder="type"></input>
                            <input type="text" onChange={changeExp} placeHolder="expiration"></input>
                            <input type="text" onChange={changeCvv} placeHolder="cvv"></input>
                            <input type="text" onChange={changeBilling} placeHolder="billing address"></input>
                            <button onClick={() => setEditCard(!editCard)}>Cancel</button>
                            <button onClick={() => handleAdd()}>Submit</button>
                        </div>) : (
                            <button onClick={() => setEditCard(!editCard)}>Add Card</button>
                        )
                    }
                    {cards.map((number) => (<Card key={number} number={number} cookie={cookie}/>))}
                </div>
            ) : (
                <p>Loading...</p>
            )}  
        </div>
    );
}
export default Payment