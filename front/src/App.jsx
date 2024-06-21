// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import LoginMenu from "./LoginMenu";

function App() {
    const [isConnected, setIsConnected] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
	if (isConnected) {
	    navigate('/dashboard');
	}
    }, [isConnected, navigate]);
    

    if (!isConnected)
	return (<> <LoginMenu setIsConnected={setIsConnected} /> </>);
    else
	return (<><h1>Erreur 404, page introuvable</h1></>);
}

export default App
