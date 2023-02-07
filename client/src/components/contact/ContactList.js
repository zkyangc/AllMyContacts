import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:3001/contacts');
      setContacts(result.data);
      console.log(result.data);
    };
    fetchData();
  }, []);
  
  const onDelete = () => {
		
	};

  return (
    <ul>
      {contacts.map(contact => (
      <>
        <li key={contact.id}>{contact.first_name} ({contact.mobile})</li>
        
        <div className="card bg-light">
			<h3 className="text-primary text-left">
				{contact.first_name}{" "} {contact.last_name}
				<span
					style={{ float: "right" }}
					
				>
				</span>
			</h3>
			<ul className="list">
				{contact.email && (
					<li>
						<i className="fas fa-envelope" /> {contact.email}
					</li>
				)}
				{contact.mobile && (
					<li>
						<i className="fa fa-mobile" /> {contact.mobile}
					</li>
				)}
        {contact.tel && (
					<li>
						<i className="fa fa-phone" /> {contact.tel}
					</li>
				)}
			</ul>
			<p>
				<button
					className="btn btn-dark btn-sm"
				>
					Edit
				</button>
				<button className="btn btn-danger btn-sm" onClick={onDelete}>
					Delete
				</button>
			</p>
		</div>
      </>  
      ))}
    </ul>
  );
};

export default ContactsList;