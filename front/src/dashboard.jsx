// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './dashboard.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NewTicketDialog from './newTicketDialog.jsx'
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';

function Dashboard() {
    const token = Cookies.get('token');
    const username = Cookies.get('username');
    const [anchor, setAnchor] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState({ priority:'',
							   admin:'',
							   category:'',
							   assignedList:[],
							   title:'',
							   description:'' });
    const [sendTicket, setSendTicket] = useState(false);
    const [tickets, setTickets] = useState({ pending:[], covered:[], dev:[], toBeVerified:[], completed:[] });
    const [search, setSearch] = useState('');

    async function executeSearch(testedArray, searchFilter)
    {
	if (searchFilter === '' || testedArray.length == 0)
	    return testedArray;
	return await testedArray.filter((ticket) => ticket.title.includes(searchFilter));
    }
    
    async function getTickets(searchFilter)
    {
	let tmp = { pending:[], covered:[], dev:[], toBeVerified:[], completed:[] };
	let res = await fetch('http://localhost:8000/api/ticketManagement/getCategory?username=' + username + '&token=' + token + '&category=' + 0);
	if (res.ok)
	{
	    tmp.pending = await res.json();
	    tmp.pending = await executeSearch(tmp.pending, searchFilter);
	}

	res = await fetch('http://localhost:8000/api/ticketManagement/getCategory?username=' + username + '&token=' + token + '&category=' + 1);
	if (res.ok)
	    tmp.covered = await res.json();
	res = await fetch('http://localhost:8000/api/ticketManagement/getCategory?username=' + username + '&token=' + token + '&category=' + 2);
	if (res.ok)
	    tmp.dev = await res.json();
	res = await fetch('http://localhost:8000/api/ticketManagement/getCategory?username=' + username + '&token=' + token + '&category=' + 3);
	if (res.ok)
	    tmp.toBeVerified = await res.json();
	res = await fetch('http://localhost:8000/api/ticketManagement/getCategory?username=' + username + '&token=' + token + '&category=' + 4);
	if (res.ok)
	    tmp.completed = await res.json();
	setTickets(tmp);
    	console.log('Tickets : ', tickets);
    }
    
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

    async function createTicket()
    {
	const res = await fetch('http://localhost:8000/api/ticketManagement/add'
				+ '?username=' + username
				+ '&token=' + token
				+ '&priority=' + selectedValues.priority
				+ '&admin=' + selectedValues.admin
				+ '&category=' + selectedValues.category
				+ '&assigned=' + selectedValues.assignedList.toString()
				+ '&title=' + selectedValues.title
				+ '&description=' + selectedValues.description);
	if (res.ok)
	{
	    console.log('Ticket successfully created !');
	    getTickets('');
	}
	else
	    console.error('Error during the creation of the ticket !');
    }

    function searchTicket(newSearch) {
	setSearch(newSearch);
	getTickets(newSearch);
    };
    
    const handleNewTicketButton = () => {
	setOpen(true);
    };

    const handleInterrupt = (newSelectedValues) => {
	setOpen(false);
	setSelectedValues(newSelectedValues);
    };
    
    const handleClose = (newSelectedValues) => {
	setOpen(false);
        setSelectedValues(newSelectedValues);
	setSendTicket(true);
    };

    function displayTicket(ticket)
    {
	let colorStyle = 'yellow';
	if (ticket.priority === 'Très Basse')
	    colorStyle = 'lightgreen';
	else if (ticket.priority === 'Basse')
	    colorStyle = 'green';
	else if (ticket.priority === 'Haute')
	    colorStyle = 'orange';
	else if (ticket.priority === 'Très Haute')
	    colorStyle = 'red';
	return(
	    <div className='ticket-container' key={ticket.title} style={{'backgroundColor': colorStyle}}>
		<h3>{ticket.title}</h3>
		<p>{ticket.description}</p>
	    </div>
	);
    }
	

    useEffect(() => {
	getTickets('');
	setSendTicket(false);
    }, []);

    authentificationVerif();
    if (sendTicket)
    {
	createTicket()
	setSelectedValues({ priority:'',
			    admin:'',
			    category:'',
			    assignedList:[],
			    title:'',
			    description:'' });
	setSendTicket(false);
    }


    return(<>
	       <h2>Tableau de Bord</h2>
	       <div className='top-line-dashboard'>
		   <div className='top-dashboard-elem'>
		       <Button variant="outlined" onClick={handleNewTicketButton} startIcon={<AddIcon />}>Nouveau</Button>
		       <NewTicketDialog
			   selectedValues={selectedValues}
			   open={open}
			   onClose={handleClose}
			   onInterrupt={handleInterrupt}
		       />
		   </div>
		   <div className='top-dashboard-elem'>
		       <TextField
			   label='Search ticket'
			   type='text'
			   value={search}
			   onChange={evt => searchTicket(evt.target.value) }
		       />
		   </div>
	       </div>
	       <div className='ticket-status-menu'>
		   <div className='ticket-status-box'>
		       <p>En attente {tickets.pending.length}</p>
		       <Divider />
		       {tickets.pending.map((displayTicket))}
		   </div>
	       	   <div
		       className='ticket-status-box'
		   >
		       <p>Pris en charge {tickets.covered.length}</p>
		       <Divider />
		       {tickets.covered.map((displayTicket))}
		   </div>
		   <div
		       className='ticket-status-box'
		   >
		       <p>En développement {tickets.dev.length}</p>
		       <Divider />
		       {tickets.dev.map((displayTicket))}
		   </div>
		   <div
		       className='ticket-status-box'
		   >
		       <p>A vérifier {tickets.toBeVerified.length}</p>
		       <Divider />
		       {tickets.toBeVerified.map((displayTicket))}
		   </div>
		   <div
		       className='ticket-status-box'
		   >
		       <p>Terminé {tickets.completed.length}</p>
		       <Divider />
		       {tickets.completed.map((displayTicket))}
		   </div>
	       </div>
	   </>)
}

export default Dashboard;
