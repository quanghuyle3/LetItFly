import Account from "./Account";
import Payment from "./Payment";
import VehicleInformation from "./VehicleInformation";
import { Fragment, useEffect } from "react";
import React, { useState } from 'react';
import "../css/Settings.css";

function Settings({cookie}) {

    const [userData, setUserData] = useState([]);
    const [activeTab, setActiveTab] = useState('tab1');
  
    var shouldShowTab = true; 
    
    useEffect(() => {
        fetch(`http://localhost:8080/api/user/findByEmail?email=${cookie.email}`, {
        headers: { "Content-Type": "application/json" },
        "Authorization": "Bearer " + cookie.token
        }).then((response) => {
            response.json().then((jsonData) => {
                const dataArray = jsonData.roles;
                setUserData(dataArray);
            })
        })
    }, []);
    
    userData.map((item) => {
        if(item.name == "ROLE_PASSENGER") {
            shouldShowTab = false; 
        }
    })

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    }
    
    return (
        <div className="row">
            <div className="tab-bar">
                <button
                className={activeTab === 'tab1' ? 'active' : ''}
                onClick={() => handleTabClick('tab1')}
                >
                Account
                </button>
                <button
                className={activeTab === 'tab2' ? 'active' : ''}
                onClick={() => handleTabClick('tab2')}
                >
                Payment Information
                </button>
                {shouldShowTab && (
                <button
                    className={`tab-button ${activeTab === 'tab3' ? 'active' : ''}`}
                    onClick={() => handleTabClick('tab3')}
                >
                    Vehicle Information 
                </button>
            )}

            </div>
            <div className="tab-content">
                {activeTab === 'tab1' && <Account cookie={cookie}/>}
                {activeTab === 'tab2' && <Payment cookie={cookie}/>}
                {activeTab === 'tab3' && <VehicleInformation cookie={cookie}/>}
            </div>
     </div>
    );
}
export default Settings;