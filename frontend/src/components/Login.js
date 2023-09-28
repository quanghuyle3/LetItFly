import React from 'react';
import { useState } from 'react';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <p>Hello</p>
    )
    
}

export default Login;
