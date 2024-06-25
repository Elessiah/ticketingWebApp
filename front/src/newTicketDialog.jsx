import * as React from 'react';

function NewTicketDialog(props) {
    const {onClose, selectedValues, open } = props;
    const [priority, setPriority] = useState('');

    const handleClose = () => {
	onClose(selectedValues);
    };

    const handleSubmit = (values) => {
	onClose(values);
    }

    return (
	<Dialog onClose={handleClose} open={open}>
	    <DialogTitle>Create a new Ticket</DialogTitle>
	    <FormControl fullWidth>
		<InputLabel id="demo-simple-select-label">Age</InputLabel>
		<Select
		    labelId="demo-simple-select-label"
		    id="demo-simple-select"
		    value={priority}
		    label="Priorité"
		    onChange={(event) => { setPriority(event.target.value) }}
		>
		    <MenuItem value={10}>Très Basse</MenuItem>
		    <MenuItem value={20}>Basse</MenuItem>
		    <MenuItem value={30}>Normal</MenuItem>
		    <MenuItem value={40}>Haute</MenuItem>
		    <MenuItem value={50}>Très Haute</MenuItem>
		</Select>
	    </FormControl>
	</Dialog>
    )
}

export default NewTicketDialog;
