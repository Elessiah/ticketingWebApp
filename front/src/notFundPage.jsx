// src/App.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import './notFundPage.css';

function NotFundPage() {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
	await navigate('/');
    };

    return(
	<>
	    <h1>404</h1>
	    <h3>Cette page n'existe pas !</h3>
	    <Button onClick={handleSubmit} variant="contained">
		Retour sur l'application
	    </Button>
	</>
    );
}

export default NotFundPage
