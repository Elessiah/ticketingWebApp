//LoginMenu.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button} from '@mui/material';
import './LoginMenu.css';
import WS from './WS';
import CryptoJS from 'crypto-js';

function LoginMenu({ webSocket, setToken}) {
    const [username, setUsername] = useState('');
    const [colorUsername, setColorUsername] = useState('')
    const [errorMsgUsername, setErrorMsgUsername] = useState('');
    const [errorValueUsername, setErrorValueUsername] = useState(false);
    const [password, setPassword] = useState('');
    const [errorMsgPassword, setErrorMsgPassword] = useState('');
    const [colorPassword, setColorPassword] = useState('')
    const [errorValuePassword, setErrorValuePassword] = useState(false);
    const [isLogIn, setIsLogIn] = useState(true);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
	webSocket.onData = onData;
	webSocket.onConnected = () => setConnected(true);
	webSocket.onDisconnected = () => setConnected(false);
    });
    
    const handleUsernameChange = (event) => {
	setUsername(event.target.value);
	if (!isLogIn && (username.length < 3 || username.length > 20))
	{
	    setColorUsername('error');
	    setErrorMsgUsername('Doit être compris entre 3 et 20 caractères !');
	    setErrorValueUsername(true);
	}
	else
	{
	    setColorUsername('success');
	    setErrorMsgUsername('');
	    setErrorValueUsername(false);
	}
    };

    const handlePasswordChange = (event) => {
	setPassword(event.target.value);
	if (!isLogIn && (password.length < 8 || username.length > 40))
	{
	    setColorPassword('error');
	    setErrorMsgPassword('Doit être compris entre 3 et 20 caractères !');
	    setErrorValuePassword(true);
	}
	else
	{
	    setColorPassword('success');
	    setErrorMsgPassword('');
	    setErrorValuePassword(false);
	}
    };

    function onData(data) {
	if (data === -1)
	{
	    setErrorValueUsername(true);
	    setErrorMsgUsername('Wrong username or password');
	    setErrorValuePassword(true);
	    setErrorMsgPassword('Wrong username or password');
	}
	else
	    setToken(data);
    }

    const handleSubmit = (event) => {
/*	if (!connected)
	{
	    setErrorValueUsername(true);
	    setErrorMsgUsername('Network Issue, please try again later !');
	    setErrorValuePassword(true);
	    setErrorMsgPassword('Network Issue, please try again later !');
	    return;
	} */
	if (errorValueUsername || errorValuePassword)
	    return;
	event.preventDefault();

	const tokenTry = CryptoJS.SHA512(username + password).toString();
	//webSocket.send(tokenTry);
	setToken(tokenTry);
		    
	// Logique de connexion à ajouter ici
	console.log('Username:', username);
	console.log('Password:', password);
    };

    return (
	<div className="login-container">
	    <form onSubmit={handleSubmit} className="login-form">
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
			onInput={handleUsernameChange}
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
			onInput={handlePasswordChange}
			placeholder="Enter your password"
			required
		    />
		</div>
		<Button
		    variant="contained"
		    type="submit"
		>{isLogIn ? ( <>Se connecter</> ) : (<>S'inscrire</>)}</Button>
		<p>
		    {isLogIn ? (
			<>
			    Pas de compte ? <a style={{ cursor: 'pointer' }} onClick={() => setIsLogIn(false)}>S'inscrire</a>
			</>
		    ) : (
			<>
			    Déjà inscrit ? <a style={{ cursor: 'pointer' }}  onClick={() => setIsLogIn(true)}>Se connecter</a>
			</>
		    )}
		</p>
	    </form>
	</div>
    );
}

export default LoginMenu;
