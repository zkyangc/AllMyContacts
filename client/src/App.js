import './App.css';
import React from 'react';

import Navbar from "./components/layout/Navbar";
import ContactsList from './components/contact/ContactList';
import VCardUpload from './components/VCardUpload';

const App = () => {
	return (
	<div>
	    <Navbar />
        <ContactsList/>
        <VCardUpload/>
    </div>
    

	);
};
export default App;
