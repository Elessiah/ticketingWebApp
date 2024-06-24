//LoginMenu.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button} from '@mui/material';
import './LoginMenu.css';
import Cookies from 'js-cookie';

function LoginMenu({ setIsConnected }) {
    
    const [username, setUsername] = useState({ value : '', color : null, errorMsg : '', errorValue : false });
    const [password, setPassword] = useState({ value : '', color : null, errorMsg : '', errorValue : false });
    const [isLogIn, setIsLogIn] = useState(true);

    function passwordInputEdit(newPassword)
    {
	if (!isLogIn && (newPassword.length < 8 || newPassword.length > 40))
	    setPassword({ value: newPassword, color: 'error', errorMsg:'Doit être compris entre 8 et 40 caractères', errorValue: true });
	else if (!isLogIn)
	    setPassword({ value: newPassword, color: 'success', errorMsg:'Super mot de passe', errorValue: false });
	else
	    setPassword({ value: newPassword, color: null, errorMsg:'', errorValue: false});
    }

    function usernameInputEdit(newUsername)
    {
	if (!isLogIn && (newUsername.length < 3 || newUsername.length > 20))
	    setUsername({ value: newUsername, color: 'error', errorMsg:'Doit être compris entre 3 et 20 caractères', errorValue: true });
	else if (!isLogIn)
    	    setUsername({ value: newUsername, color: 'success', errorMsg:'Super nom !', errorValue: false });
	else
	    setUsername({ value: newUsername, color: null, errorMsg:'', errorValue: false});
    }

    function switchLoginMod(newLoginValue)
    {
	setUsername({ value: '', color: null, errorMsg:'', errorValue: false });
	setPassword({ value: '', color: null, errorMsg:'', errorValue: false });
	if (isLogIn)
	    setIsLogIn(false);
	else
	    setIsLogIn(true);
    }

    const handleSubmit = async (event) => {
	if (username.errorValue || password.errorValue)
	    return;
	if (isLogIn)
	{
	    const res = await fetch('http://localhost:8000/api/login/?login=' + username + '&password=' + password);
	    if (res.ok)
	    {
		const data = await res.json();
		Cookies.set('token', data.hash, {secure: true, sameSite: 'none'});
		Cookies.set('username', username, {secure: true, sameSite: 'none'});
		setIsConnected(true);
	    }
	    else if (res.status == 409)
	    {
		setUsername({ value: username.value, color: 'error', errorMsg:'Mauvais mot de passe ou nom d\'utilisateur', errorValue: true });
		setPassword({ value: password.value, color: 'error', errorMsg:'Mauvais mot de passe ou nom d\'utilisateur', errorValue: true });
	    }
	}
	else
	{
	    const res = await fetch('http://localhost:8000/api/signUp/?login=' + username + '&password=' + password);
	    const text = await res.text();
	    if (res.ok)
	    {
		setIsLogIn(true);
		setUsername({ value: '', color: 'success', errorMsg: 'Inscrit avec succès !', errorValue: false });
		setPassword({ value: '', color: 'success', errorMsg: 'Inscrit avec succès !', errorValue: false });
	    }
	    else
	    {
		setUsername({ value: '', color: 'error', errorMsg: text, errorValue: true });
		setPassword({ value: '', color: 'error', errorMsg: text, errorValue: true });
	    }
	}
    };

    return (
	<div className="login-container">
	    <div className="login-form">
		<h2>{isLogIn ? (<>Connexion</>) : (<>Inscription</>)}</h2>
		<div className="form-group">
		    <TextField
			error={username.errorValue}
			id={username.errorValue ? "outlined-error-helper-text" : "username"}
			helperText={username.errorMsg}
			color={username.color}
			autoComplete="username"
			label="Nom d'utilisateur"
			type="text"
			value={username.value}
			onChange={evt => usernameInputEdit(evt.target.value)}
			placeholder="Enter your username"
			required
		    />
		</div>
		<div className="form-group">
		    <TextField
			error={password.errorValue}
			id={password.errorValue ? "outlined-error-helper-text" : "username"}
			helperText={password.errorMsg}
			color={password.color}
			autoComplete={isLogIn ? "current-password" : "new-password"}
			label="Mot de passe"
			type="password"
			value={password.value}
			onChange={evt => passwordInputEdit(evt.target.value)}
			placeholder="Enter your password"
			required
		    />
		</div>
		<Button
		    onClick={handleSubmit}
		    variant="contained"
		    type="submit"
		>{isLogIn ? ( <>Se connecter</> ) : (<>S'inscrire</>)}</Button>
		<p>
		    {isLogIn ? (
			<>
			    Pas de compte ? <a style={{ cursor: 'pointer' }} onClick={() => switchLoginMod()}>S'inscrire</a>
			</>
		    ) : (
			<>
			    Déjà inscrit ? <a style={{ cursor: 'pointer' }}  onClick={() => switchLoginMod()}>Se connecter</a>
			</>
		    )}
		</p>
	    </div>
	</div>
    );
}

export default LoginMenu;
