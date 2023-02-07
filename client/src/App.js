import logo from './logo.svg';
import './App.css';
import React from 'react';

import Navbar from "./components/layout/Navbar";
import ContactsList from './components/contact/ContactList';

const App = () => {
	return (
	<div>
	  <Navbar />
    <ContactsList/>
  </div>
    

	);
};
export default App;
