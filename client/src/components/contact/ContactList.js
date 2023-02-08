import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContact, setEditingContact] = useState(null);
  
  useEffect(() => {
    const fetchContacts = async () => {
      const result = await axios.get('/api/contacts');
      setContacts(result.data);
      console.log(result.data);
    };
    fetchContacts();
  }, []);
  
  const onDelete = (id, name) => {
		if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .then(() => {
          console.log('Deleted');
          setContacts(contacts.filter((contact) => contact.id !== id));
        })
        .catch((error) => {
          console.error(error);
        });
    }
	};
	
	const handleSearch = event => {
    setSearchQuery(event.target.value);
  };
	
  const filteredContacts = contacts.filter(
    contact =>
      contact.full_name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
  );

  return (
    <>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search contacts..."
      />
        <ul>
        {filteredContacts.map(contact => (
          <>        
            <div className="card bg-light">
  			      <h3 className="text-primary text-left">
        				{contact.full_name}
        				<span style={{ float: "right" }}></span>
        			</h3>
        			<ul className="list">
        				{contact.email && (
        					<li>
        						<i className="fas fa-envelope" /> {contact.email}
        					</li>
        				)}
        				{contact.phone && (
        				  <>
        				    {contact.phone.split(',').map(phone => 
                      (<li>
                        {phone.replace()}
                      </li>)
                    )}
        				  </>
  				      )}
  			      </ul>
        			<p>
        				<button className="btn btn-dark btn-sm">
        					Edit
        				</button>
        				<button className="btn btn-danger btn-sm" onClick={() => onDelete(contact.id, contact.full_name)}>
        					Delete
        				</button>
    			    </p>
  		    </div>
        </>  
        ))}
      </ul>
    </>
  );
};

export default ContactsList;
