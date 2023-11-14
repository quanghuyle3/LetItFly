import "../css/Settings.css";
import Card from "../components/Card";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';
import { isValidName, isValidCard, isValidCardType, isValidExpiration,isValidCVV, isValidAddress } from "../Forms/Validation"

function Payment({cookie}) {

    const [userInfo, setUserInfo] = useState(null);
    const [editCard, setEditCard] = useState(false);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [type, setType] = useState('');
    const [exp, setExp] = useState('');
    const [cvv, setCvv] = useState('');
    const [billing, setBilling] = useState('');
    const [nameError, setNameError] = useState(false);
    const [numberError, setNumberError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const [expError, setExpError] = useState(false);
    const [cvvError, setCvvError] = useState(false);
    const [billingError, setBillingError] = useState(false);
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

    function resetBooleans() {
        setNameError(false);
        setNumberError(false);
        setTypeError(false);
        setExpError(false);
        setCvvError(false);
        setBillingError(false);
        setName('');
        setNumber('');
        setType('');
        setExp('');
        setCvv('');
        setBilling('');
        }

    const handleAdd = () => {
        if(isValidName(name) && isValidCard(number) && isValidCardType(type) && isValidExpiration(exp) && isValidCVV(cvv) && isValidAddress(billing)) {
            var PaymentRequest = {
                cardNumber: number,
                expiration: exp,
                cvv: cvv,
                type: type,
                userId: cookie.id,
                name: name, 
                billingAddress: billing, 
            };

            fetch("http://localhost:8080/api/payment/save", {
            method: "POST",
            headers: { "Content-Type": "application/json", 
            "Authorization": "Bearer " + cookie.token},
            body: JSON.stringify(PaymentRequest)
            }).then((response) => {
                return response.status;
            }).then((result) => {
                if(result == 200) {
                    window.location.reload();
                    alert("Update Successfull");
                }
                else{
                    window.location.reload();
                    alert("Duplicate Card! Unsuccessfull");
                }
            }).catch((error) => {
                console.error("Update failed:", error);
            }); 
        }
        else
        {
            if(!isValidName(name)) {
                setNameError(true);
            }
            else
            {
                setNameError(false);
            }
            if(!isValidCard(number)) {
                setNumberError(true);
            }
            else{
                setNumberError(false);
            }
            if(!isValidCardType(type)) {
                setTypeError(true);
            }
            else
            {
                setTypeError(false);
            }
            if(!isValidExpiration(exp)) {
                setExpError(true);
            }
            else
            {
                setExpError(false);
            }
            if(!isValidCVV(cvv)) {
                setCvvError(true);
            }
            else
            {
                setCvvError(false);
            }
            if(!isValidAddress(billing)) {
                setBillingError(true);
            }
            else
            {
                setBillingError(false);
            }
        }
    };

    return (
        <div className="row">
            {userInfo !== null ? ( 
                <div>
                    <h1>Payment Information: </h1>
                    {editCard ? (
                        <div>
                            <input type="text" onChange={changeName} placeholder="name"></input>
                            {nameError && <small>Invalid Name: Only Letters!</small>}
                            <input type="text" onChange={changeNumber}placeholder="card number"></input>
                            {numberError && <small>Invalid Number: 16 digit number!</small>}
                            <input type="text" onChange={changeType} placeholder="type"></input>
                            {typeError && <small>Invalid Type: Only letters!</small>}
                            <input type="text" onChange={changeExp} placeholder="expiration"></input>
                            {expError && <small>Invalid Expiration: month/year: **/****</small>}
                            <input type="text" onChange={changeCvv} placeholder="cvv"></input>
                            {cvvError && <small>Invalid CVV: 3 or 4 digits!</small>}
                            <input type="text" onChange={changeBilling} placeholder="billing address"></input>
                            {billingError && <small>Invalid Billing Address. No special characters</small>}
                            <button onClick={() => {setEditCard(!editCard); resetBooleans()}}>Cancel</button>
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