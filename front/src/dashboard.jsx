// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NewTicketDialog from './newTicketDialog.jsx';
import VisibilityDialog from './VisibilityDialog.jsx';
import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';

function Dashboard() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const [openVisibility, setOpenVisibility] = useState(false);
    const [selectedValues, setSelectedValues] = useState({ priority:'',
							   admin:'',
							   category:'',
							   assignedList:[],
							   title:'',
							   description:'',
							   id:0});
    const [ticketMenu, setTicketMenu] = useState({ open:false,
						   title:'Créer un ticket',
						   values:selectedValues,
						   onClose:null,
						   onInterrupt:null});

    const [sendTicket, setSendTicket] = useState(false);
    const [tickets, setTickets] = useState({ pending:[], covered:[], dev:[], toBeVerified:[], completed:[] });
    const [visibility, setVisibility] = useState({ pending:true, covered:true, dev:true, toBeVerified:true, completed:false });
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
	    await localStorage.removeItem('token');
	    await localStorage.removeItem('username');
	    await navigate('/404');
	}
    };

    async function createTicket(values)
    {
	const res = await fetch('http://localhost:8000/api/ticketManagement/add'
				+ '?username=' + username
				+ '&token=' + token
				+ '&priority=' + values.priority
				+ '&admin=' + values.admin
				+ '&category=' + values.category
				+ '&assigned=' + values.assignedList.toString()
				+ '&title=' + values.title
				+ '&description=' + values.description);
	if (res.ok)
	{
	    console.log('Ticket successfully created !');
	    getTickets(search);
	}
	else
	    console.error('Error during the creation of the ticket !');
    }

    async function editTicket(values)
    {
	console.log('Values edit ',values);
	const res = await fetch('http://localhost:8000/api/ticketManagement/edit'
				+ '?username=' + username
				+ '&token=' + token
				+ '&priority=' + values.priority
				+ '&admin=' + values.admin
				+ '&category=' + values.category
				+ '&assigned=' + values.assignedList.toString()
				+ '&title=' + values.title
				+ '&idTicket=' + values.id
				+ '&description=' + values.description);
	if (res.ok)
	{
	    console.log('Ticket successfully edited !');
	    getTickets(search);
	}
	else
	    console.error('Error during the edition of the ticket !');
    };
    

    function searchTicket(newSearch) {
	setSearch(newSearch);
	getTickets(newSearch);
    };
    
    const handleNewTicketButton = () => {
	setTicketMenu({ open:true, title:'Créer un ticket', values:selectedValues, onClose:handleClose, onInterrupt:handleInterrupt});
    };

    const handleEditClose = (values) => {
	setTicketMenu(prevValues => ({...prevValues, open:false}));
	editTicket(values);
    };

    const handleEditTicketClick = (ticket) => {
	console.log('Ticket :', ticket);
	setTicketMenu({ open:true, title:'Editer un ticket', values:ticket, onClose:handleEditClose, onInterrupt:handleInterrupt});
    };

    const handleVisibilityTicketButton = () => {
	setOpenVisibility(true);
    };

    const handleCloseVisibility = (newSelectedValues) => {
	setOpenVisibility(false);
	setVisibility(newSelectedValues);
    };

    const handleInterrupt = (newSelectedValues) => {
	setTicketMenu(prevValues => ({...prevValues, open:false}));
	setSelectedValues(newSelectedValues);
    };
    
    const handleClose = (newSelectedValues) => {
	setTicketMenu(prevValues => ({...prevValues, open:false}));
	createTicket(newSelectedValues);
    };

    function displayTicket(ticket, index)
    {
	if (ticket === null)
	    return;
	let colorStyle = 'yellow';
	if (ticket.priority === 'Très Basse')
	    colorStyle = 'lightgreen';
	else if (ticket.priority === 'Basse')
	    colorStyle = 'green';
	else if (ticket.priority === 'Haute')
	    colorStyle = 'orange';
	else if (ticket.priority === 'Très Haute')
	    colorStyle = 'red';
	console.log(ticket.id);
	return(
	    <Draggable
		draggableId={ticket.id+''}
		index={index}
		key={ticket.id}
	    >
		{(provided) => (
		    <div
			{...provided.dragHandleProps}
			{...provided.draggableProps}
			ref={provided.innerRef}
		    >
			<div className='ticket-container'
			     key={ticket.title}
			     style={{'backgroundColor': colorStyle}}
			     onClick={(evt) => handleEditTicketClick(ticket)}>
			    <h3>{ticket.title}</h3>
			    <p>{ticket.description}</p>
			    <p><b>Responsable:</b> {ticket.admin} </p>
			</div>
		    </div>
		)}
	    </Draggable>
	);
    };
    
    
    useEffect(() => {
	getTickets('');
    }, []);

    authentificationVerif();
    
    return(<>
	       <h2>Tableau de Bord</h2>
	       <div className='top-line-dashboard'>
		   <div className='top-dashboard-elem'>
		       <Button variant="outlined" onClick={handleNewTicketButton} startIcon={<AddIcon />}>Nouveau</Button>
		       <NewTicketDialog
			   selectedValues={ticketMenu.values}
			   open={ticketMenu.open}
			   onClose={ticketMenu.onClose}
			   onInterrupt={ticketMenu.onInterrupt}
			   title={ticketMenu.title}
		       />
		   </div>
		   <div className='top-dashboard-elem'>
		       <Button variant="outlined" onClick={(evt) => getTickets(search) } startIcon={<RefreshIcon />}>Rafraîchir</Button>
		   </div>
		   <div className='top-dashboard-elem'>
		       <Button variant="outlined" onClick={handleVisibilityTicketButton} startIcon={<VisibilityIcon />}>Affichage</Button>
		       <VisibilityDialog
			   selectedValues={visibility}
			   open={openVisibility}
			   onClose={handleCloseVisibility}
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
	       <DragDropContext onDragEnd={(source, destination, type) => { console.log(source, destination, type); }} >
		   <div className='ticket-status-menu'>
		       { visibility.pending && (
			   <div className='ticket-status-box'>
			       <p>En Attente {tickets.pending.length}</p>
			       <Divider />
			       <Droppable droppableId="DropPending">
				   {(provided) => (
				       <div {...provided.droppableProps} ref={provided.innerRef}>
					   {tickets.pending.map((displayTicket))}
					   {provided.placeholder}
				       </div>
				   )}
			       </Droppable>
			   </div>
		       )}
		       { visibility.covered && (
	       		   <div
			       className='ticket-status-box'
			   >
			       <p>Pris En Charge {tickets.covered.length}</p>
			       <Divider />
			       {tickets.covered.map((displayTicket))}
			   </div>
		       )}
		       { visibility.dev && (
			   <div
			       className='ticket-status-box'
			   >
			       <p>En Développement {tickets.dev.length}</p>
			       <Divider />
			       {tickets.dev.map((displayTicket))}
			   </div>
		       )}
		       { visibility.toBeVerified && (
			   <div
			       className='ticket-status-box'
			   >
			       <p>A Vérifier {tickets.toBeVerified.length}</p>
			       <Divider />
			       {tickets.toBeVerified.map((displayTicket))}
			   </div>
		       )}
		       { visibility.completed && (
			   <div
			       className='ticket-status-box'
			   >
			       <p>Terminé {tickets.completed.length}</p>
			       <Divider />
			       {tickets.completed.map((displayTicket))}
			   </div>
		       )}
		   </div>
	       </DragDropContext>
	   </>)
}

export default Dashboard;
