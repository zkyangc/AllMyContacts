import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import React from 'react';

const Navbar = ({ title, icon }) => {

    const onLogout = () => {
		//logout();
		//clearContacts();
	};
	
    const authLinks = (
		<>
			<li>Hello username</li>
			<li>
				<a onClick={onLogout} href="#!">
					<i className="fas fa-sign-out-alt"></i>{" "}
					<span className="hide-sm">Logout</span>
				</a>
			</li>
		</>
	);
	
    const guestLinks = (
		<>
			<li>
				<NavLink to="/register">Register</NavLink>
			</li>
			<li>
				<NavLink to="/login">Login</NavLink>
			</li>
		</>
	);
	
    return (
		<div className="navbar bg-primary">
			<h1>
                <i className={icon} /> {title}
			</h1>
			<ul>
				<li>
                    
				</li>
                {true ? authLinks : guestLinks}
			</ul>
		</div>
	);
};



Navbar.propTypes = {
	title: PropTypes.string.isRequired,
	icon: PropTypes.string,
};

Navbar.defaultProps = {
	title: "All My Contacts",
	icon: "fa-regular fa-address-book",
};

export default Navbar;
