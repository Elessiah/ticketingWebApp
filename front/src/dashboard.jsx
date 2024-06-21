// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './dashboard.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const token = Cookies.get('token');
    const username = Cookies.get('username');

    async function authentificationVerif()
    {
	const navigate = await useNavigate();
	const res = await fetch('http://localhost:8000/api/verify/?username=' + username + '&token=' + token);
	if (!res.ok) {
	    console.log('retour to home');
	    Cookies.remove('token');
	    Cookies.remove('username');
	    await navigate('/404');
	}
    }

    authentificationVerif();

    console.log('Your token is : ', token);
    return(<> Welcome to The DashBoard ! {token} </>)
}

export default Dashboard
