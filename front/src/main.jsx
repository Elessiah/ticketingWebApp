import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx'
import Dashboard from './dashboard.jsx'
import NotFundPage from './notFundPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
	<Router>
	    <Routes>
		<Route path="/" element={<App />} />
		<Route path="/dashboard" element={<Dashboard />} />
		<Route path="/404" element={<NotFundPage />} />
	    </Routes>
	</Router>
)

