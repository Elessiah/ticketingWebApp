// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import LoginMenu from "./LoginMenu"

function App() {
    const [token, setToken] = useState('');

    return (
	<>
	    {token === '' ? (<> <LoginMenu setToken={setToken} /> </>) : ( <>ça fonctionne ! {token} </> )}
	</>
    )
}

export default App
