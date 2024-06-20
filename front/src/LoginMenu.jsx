//LoginMenu.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button} from '@mui/material';
import './LoginMenu.css';
import CryptoJS from 'crypto-js';

function LoginMenu({ setToken }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogIn, setIsLogIn] = useState(true);
    let colorPassword = null ;
    let errorMsgPassword = '';
    let errorValuePassword = false;
    let colorUsername = null;
    let errorMsgUsername = '';
    let errorValueUsername = false;

    if (!isLogIn && (password.length < 8 || password.length > 40))
    {
	errorValuePassword = true;
	colorPassword = 'error';
	errorMsgPassword = 'Doit être compris entre 8 et 40 caractères';
    }
    else if (!isLogIn)
    {
	errorValuePassword = false;
	colorPassword = 'success';
	errorMsgPassword = 'Super mot de passe';
    }

    if (!isLogIn && (username.length < 3 || username.length > 20))
    {
	errorValueUsername = true;
	colorUsername = 'error';
	errorMsgUsername = 'Doit être compris entre 3 et 20';
    }
    else if (!isLogIn)
    {
	errorValueUsername = false;
	colorUsername = 'success';
	errorMsgUsername = 'Super nom !';
    }

    function switchLoginMod(newLoginValue)
    {
	setUsername('');
	setPassword('');
	if (isLogIn)
	    setIsLogIn(false);
	else
	    setIsLogIn(true);
    }

    const handleSubmit = async (event) => {
	if (errorValueUsername || errorValuePassword)
	    return;
	console.log(username, password)
	if (isLogIn)
	{
	    const res = await fetch('http://localhost:8000/api/login/?login=' + username + '&password=' + password);
	    if (res.ok)
	    {
		const data = await res.json();
		setToken(data.hash);
	    }
	    else if (res.status == 409)
	    {
		errorValuePassword = true;
		colorPassword = 'error';
		errorMsgPassword = 'Mauvais mot de passe ou nom d\'utilisateur';
		errorValueUsername = true;
		colorUsername = 'error';
		errorMsgUsername = 'Mauvais mot de passe ou nom d\'utilisateur';
	    }
	}
	else
	{
	    await fetch('http://localhost:8000/api/signUp/?login=' + username + '&password=' + password);
	}
    };

    return (
	<div className="login-container">
	    <div className="login-form">
		<h2>{isLogIn ? (<>Connexion</>) : (<>Inscription</>)}</h2>
		<div className="form-group">
		    <TextField
			error={errorValueUsername}
			id={errorValueUsername ? "outlined-error-helper-text" : "username"}
			helperText={errorMsgUsername}
			color={colorUsername}
			autoComplete="username"
			label="Nom d'utilisateur"
			type="text"
			value={username}
			onChange={evt => setUsername(evt.target.value)}
			placeholder="Enter your username"
			required
		    />
		</div>
		<div className="form-group">
		    <TextField
			error={errorValuePassword}
			id={errorValuePassword ? "outlined-error-helper-text" : "username"}
			helperText={errorMsgPassword}
			color={colorPassword}
			autoComplete={isLogIn ? "current-password" : "new-password"}
			label="Mot de passe"
		type="password"
			value={password}
			onChange={evt => setPassword(evt.target.value)}
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
