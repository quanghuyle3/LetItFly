import "../css/Settings.css";
import Vehicle from "../components/Vehicle";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';
import { isValidLicensePlate, isValidMake, isValidModel, isValidCarYear } from "../Forms/Valdiation"

function VehicleInformation({cookie}) {

    const [userInfo, setUserInfo] = useState(null);
    const [editCar, setEditCar] = useState(false);
    const vehics = [];

    const [plate, setPlate] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [type, setType] = useState('');

    const [plateError, setPlateError] = useState(false);
    const [makeError, setMakeError] = useState(false);
    const [modelError, setModelError] = useState(false);
    const [yearError, setYearError] = useState(false);
    const [typeError, setTypeError] = useState(false);


    useEffect(() => {
        fetch(`http://localhost:8080/api/vehicle/findByUserId?userId=${cookie.id}`, {
        headers: { "Content-Type": "application/json",
        "Authorization": "Bearer " + cookie.token}
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

    const changePlate = (event) => {
        setPlate(event.target.value); 
    }

    const changeMake = (event) => {
        setMake(event.target.value); 
    }

    const changeModel = (event) => {
        setModel(event.target.value); 
    }

    const changeYear = (event) => {
        setYear(event.target.value); 
    }

    const changeType = (event) => {
        setType(event.target.value); 
    }

    function resetBooleans() {
        setPlateError(false);
        setMakeError(false);
        setModelError(false);
        setYearError(false);
        setTypeError(false);
        setPlate('');
        setMake('');
        setModel('');
        setYear('');
        setType('');
    }

    const handleAdd = () => {
        if(isValidLicensePlate(plate) && isValidMake(make) && isValidModel(model) && isValidCarYear(year) && isValidMake(type)) {
            var VehicleRequest = {
                licensePlate: plate,
                make: make,
                model: model,
                year: year,
                type: type,
                userId: cookie.id
            };

            fetch("http://localhost:8080/api/vehicle/save", {
            method: "POST",
            headers: { "Content-Type": "application/json", 
            "Authorization": "Bearer " + cookie.token},
            body: JSON.stringify(VehicleRequest)
            }).then((response) => {
                return response.status;
            }).then((result) => {
                if(result == 200) {
                    window.location.reload();
                    alert("Update Successfull");
                }
                else{
                    window.location.reload();
                    alert("Duplicate Vehicle! Unsuccessfull");
                }
            }).catch((error) => {
                console.error("Update failed:", error);
            }); 
        }
        else
        {
            if(!isValidLicensePlate(plate)) {
                setPlateError(true);
            }
            else
            {
                setPlateError(false);
            }
            if(!isValidMake(make)) {
                setMakeError(true);
            }
            else{
                setMakeError(false);
            }
            if(!isValidModel(model)) {
                setModelError(true);
            }
            else
            {
                setModelError(false);
            }
            if(!isValidCarYear(year)) {
                setYearError(true);
            }
            else
            {
                setYearError(false);
            }
            if(!isValidMake(type)) {
                setTypeError(true);
            }
            else
            {
                setTypeError(false);
            }
        }
    };

    return (
        <div className="row">
            {userInfo !== null ? ( 
                <div>
                    <h1>Vehicle Information:</h1>
                    {editCar ? (
                        <div>
                            <input type="text" onChange={changePlate} placeholder="license plate"></input>
                            {plateError && <small>Invalid</small>}
                            <input type="text" onChange={changeMake}placeholder="make"></input>
                            {makeError && <small>Invalid</small>}
                            <input type="text" onChange={changeModel} placeholder="model"></input>
                            {modelError && <small>Invalid</small>}
                            <input type="text" onChange={changeYear} placeholder="year"></input>
                            {yearError && <small>Invalid</small>}
                            <input type="text" onChange={changeType} placeholder="type"></input>
                            {typeError && <small>Invalid</small>}
                            <button onClick={() => {setEditCar(!editCar); resetBooleans()}}>Cancel</button>
                            <button onClick={() => handleAdd()}>Submit</button>
                        </div>
                    ):( 
                        <button onClick={() => setEditCar(!editCar)}>Add Vehicle</button>
                    )
                    }
                    {vehics.map((number) => (<Vehicle key={number} number={number} cookie={cookie}/>))}
                </div>
            ) : (
                <p>Loading...</p>
            )}  
        </div>
    );
}
export default VehicleInformation;