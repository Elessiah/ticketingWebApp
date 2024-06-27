// NewTicketDialog
import OutlinedInput from '@mui/material/OutlinedInput';
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import './newTicketDialog.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function NewTicketDialog(props) {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const {onClose, selectedValues, open, onInterrupt, title } = props;
    const [values, setValues] = useState({ priority:selectedValues.priority,
					   admin:selectedValues.admin,
					   category:selectedValues.category,
					   assignedList:selectedValues.assignedList,
					   title:selectedValues.title,
					   description:selectedValues.description });
    const [users, setUsers] = useState([]);

    async function getUsers() {
	const res = await fetch('http://localhost:8000/api/getUsers?username=' + username + '&token=' + token);
	if (res.ok)
	{
	    const content = await res.text();
	    const cleanedContent = content.split(',').map(item => item.replace(/"/g, '').trim());
	    setUsers(cleanedContent);
	}
	else
	    console.error('Echec de la récupération des utilisateurs');
    };
    
    useEffect(() => {
	getUsers();
    }, []);

    
    if (!Array.isArray(users))
    {
	console.error('Internal Error');
	return(<></>);
    }

    const handleClose = () => {
	onInterrupt(values);
    };

    const handleSubmit = () => {
	console.log(values);
	onClose(values);
    };

    const setPriority = (newPriority) => {
	setValues(prevValues => ({...prevValues, priority: newPriority }));
    };

    const setCategory = (newCategory) => {
	setValues(prevValues => ({...prevValues, category: newCategory }));
    };
    
    const setAdmin = (newAdmin) => {
	setValues(prevValues => ({...prevValues, admin: newAdmin }));
    };
    
    const setAssignedList = (AssignedMember) => {
	setValues(prevValues => ({...prevValues, assignedList: typeof AssignedMember === 'string' ? AssignedMember.split(',') : AssignedMember,
				 }));
    };

    function updateTitle(newTitle)
    {
	setValues(prevValues => ({...prevValues, title: newTitle}));
    }

    function updateDescription(newDescription)
    {
	setValues(prevValues => ({...prevValues, description: newDescription}));
    }

    return (
	<Dialog onClose={handleClose} open={open}>
	    <DialogTitle>{title}</DialogTitle>
	    <div className='formNewComponent'>
	    <FormControl fullWidth>
		<InputLabel id="priority-select-label">Priorité</InputLabel>
		<Select
		    labelId="priority-select-label"
		    id="priority-simple-select"
		    value={values.priority}
		    label="Priorité"
		    onChange={(event) => { setPriority(event.target.value) }}
		>
		    <MenuItem value={'Très Basse'}>Très Basse</MenuItem>
		    <MenuItem value={'Basse'}>Basse</MenuItem>
		    <MenuItem value={'Moyenne'}>Moyenne</MenuItem>
		    <MenuItem value={'Haute'}>Haute</MenuItem>
		    <MenuItem value={'Très Haute'}>Très Haute</MenuItem>
		</Select>
	    </FormControl>
	    </div>
	    <div className='formNewComponent'>
		<FormControl fullWidth>
		    <InputLabel id="admin-select-label">Responsable</InputLabel>
		    <Select
			labelId="admin-select-label"
			id="admin-simple-select"
			value={values.admin}
			label="Responsable"
			onChange={(event) => { setAdmin(event.target.value) }}
		    >
			{ users.map((user) => (
			    <MenuItem key={user} value={user}>{user}</MenuItem>
			))}
		    </Select>
		</FormControl>
	    </div>
	    <div className='formNewComponent'>
		<FormControl fullWidth>
		    <InputLabel id="category-select-label">Catégorie</InputLabel>
		    <Select
			labelId="category-select-label"
			id="category-simple-select"
			value={values.category}
			label="Catégorie"
			onChange={(event) => { setCategory(event.target.value) }}
		    >
			<MenuItem value={'Code'}>Code</MenuItem>
			<MenuItem value={'Marketing'}>Marketing</MenuItem>
			<MenuItem value={'Documentation'}>Documentation</MenuItem>
			<MenuItem value={'Evènement'}>Evènement</MenuItem>
		    </Select>
		</FormControl>
	    </div>
	    <div className='formNewComponent'>
		<FormControl fullWidth>
		    <InputLabel id="assignement-select-label">Assigné(e)(s)</InputLabel>
		    <Select
			labelId="assignement-select-label"
			id="assignement-simple-select"
			multiple
			value={values.assignedList}
			label="Assigné(e)(s)"
			input={<OutlinedInput label="Assigné(e)(s)"/>}
			renderValue={(selected) => selected.join(', ')}
			onChange={(event) => { setAssignedList(event.target.value) }}
			MenuProps={MenuProps}
		    >
			{ users.map((user) => (
			    <MenuItem key={user} value={user}>
				<Checkbox checked={values.assignedList.indexOf(user) > -1} />
				<ListItemText primary={user} />
			    </MenuItem>
			))}
		    </Select>
		</FormControl>
	    </div>
	    <div className='formNewComponent'>
	    <TextField
		className='formNewComponent'
		label="Titre"
		value={values.title}
		onChange={evt => updateTitle(evt.target.value)}
		variant="outlined" />
	    </div>
	    <div className='formNewComponent'>
	    <TextField
		className='formNewComponent'
		id="outlined-multiline-static"
		label="Description"
		multiline
		rows={4}
		onChange={evt => updateDescription(evt.target.value)}
	    />
	    </div>
	    <div className='formNewComponent'>
		<Button variant="contained" className='formNewComponent' onClick={handleSubmit}>Créer</Button>
	    </div>
	</Dialog>
    )
}

export default NewTicketDialog;
