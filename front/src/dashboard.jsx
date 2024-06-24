// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './dashboard.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';

function Dashboard() {
    const token = Cookies.get('token');
    const username = Cookies.get('username');

    async function authentificationVerif()
    {
	const navigate = await useNavigate();
	const res = await fetch('http://localhost:8000/api/verify/?username=' + username + '&token=' + token);
	if (!res.ok) {
	    console.log('retour to home');
	    await Cookies.remove('token');
	    await Cookies.remove('username');
	    await navigate('/404');
	}
    }

    authentificationVerif();

    console.log('Your token is : ', token);
    return(<>
	       <div className='top-line-dashboard'>
		   <TextField
		       label='Search ticket'
		       type='text'
		       onChange={evt => searchTicket(evt.target.value) }
		   />
	       </div>
	       <div>
		   <Box
		       height={200}
		       width={200}
		   >
		   </Box>
	       </div></>)
}

export default Dashboard
