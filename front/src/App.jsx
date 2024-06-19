// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import LoginMenu from "./LoginMenu"
import WS from './WS';

function App() {
    let webSocket = new WS({onData: null});
    const [token, setToken] = useState('');

    return (
	<>
	    {token === '' ? (<> <LoginMenu webSocket={webSocket} setToken={setToken} /> </>) : ( <>ça fonctionne ! {token} </> )}
	</>
    )
}

export default App
