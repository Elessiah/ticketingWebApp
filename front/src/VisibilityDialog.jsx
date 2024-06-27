// VisibilityDialog
import React, { useState } from 'react';
import { Dialog, DialogTitle, FormGroup, FormControlLabel, Checkbox } from '@mui/material/';

function VisibilityDialog(props) {
    const {onClose, selectedValues, open} = props;
    const [values, setValues] = useState(selectedValues);

    const handleClose = () => {
	onClose(values);
    };

    const handleChange = (index) => {
	if (index == 0)
	    setValues(prevValues => ({ ...prevValues, pending:(!values.pending) }));
	else if (index === 1)
	    setValues(prevValues => ({ ...prevValues, covered:(!values.covered) }));
	else if (index === 2)
	    setValues(prevValues => ({ ...prevValues, dev:(!values.dev) }));
	else if (index === 3)
	    setValues(prevValues => ({ ...prevValues, toBeVerified:(!values.toBeVerified) }));
	else if (index === 4)
	    setValues(prevValues => ({ ...prevValues, completed:(!values.completed) }));
    }

    return(
	<Dialog onClose={handleClose} open={open}>
	    <DialogTitle>Affichage</DialogTitle>
	    <div className='display-content'>
		<FormGroup>
		    <FormControlLabel control={<Checkbox checked={values.pending} onChange={(evt) => (handleChange(0))}/>} label="En Attente" />
		    <FormControlLabel control={<Checkbox checked={values.covered} onChange={(evt) => (handleChange(1))}/>} label="Pris En Charge" />
		    <FormControlLabel control={<Checkbox checked={values.dev} onChange={(evt) => (handleChange(2))}/>} label="En Développement" />
		    <FormControlLabel control={<Checkbox checked={values.toBeVerified} onChange={(evt) => (handleChange(3))}/>} label="A vérifier" />
		    <FormControlLabel control={<Checkbox checked={values.completed} onChange={(evt) => (handleChange(4))}/>} label="Terminé" />
		</FormGroup>
	    </div>
	</Dialog>
    )
}

export default VisibilityDialog;
		
