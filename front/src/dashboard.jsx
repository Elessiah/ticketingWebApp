// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './dashboard.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import { Select as BaseSelect, selectClasses } from '@mui/base/Select';

function Dashboard() {
    const token = Cookies.get('token');
    const username = Cookies.get('username');
    const [anchor, setAnchor] = React.useState(null);

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
    };

    authentificationVerif();

    return(<>
	       <h2>Tableau de Bord</h2>
	       <div className='top-line-dashboard'>
		   <div className='top-dashboard-elem'>
		       <Button variant="outlined" onClick={handleNewTicketButton} startIcon={<AddIcon />}>Nouveau</Button>
		       <BasePopup id={id} open={open} anchor={anchor} placement='bottom-start'>
			   <div className="PopupCreation">
			       <h3>Créer un ticket</h3>
			       <div className="Priority">
				   <h4>Priorité</h4>
				   <SelectPanel selectedValues={['Très Basse', 'Basse', 'Normal', 'Haute', 'Très Haute']} optDefaultValue={2}/>
			       </div>
			   </div>
		       </BasePopup>
		   </div>
		   <div className='top-dashboard-elem'>
		       <TextField
			   label='Search ticket'
			   type='text'
			   onChange={evt => searchTicket(evt.target.value) }
		       />
		   </div>
	       </div>
	       <div className='ticket-status-menu'>
		   <Box
		       className='ticket-status-box'
		       height={400}
		       width={250}
		   >
		       <div>
			   <p>En attente 0</p>
			   <Divider />
		       </div>
		   </Box>
		   <Box
		       className='ticket-status-box'
		       height={400}
		       width={250}
		   >
		       <p>Pris en charge 0</p>
		       <Divider />
		   </Box>
		   <Box
		       className='ticket-status-box'
		       height={400}
		       width={250}
		   >
		       <p>En développement 0</p>
		       <Divider />
		   </Box>
		   <Box
		       className='ticket-status-box'
		       height={400}
		       width={250}
		   >
		       <p>A vérifier 0</p>
		       <Divider />
		   </Box>
		   <Box
		       className='ticket-status-box'
		       height={400}
		       width={250}
		   >
		       <p>Terminé 0</p>
		       <Divider />
		   </Box>
	       </div>
	   </>)
}

export default Dashboard;
