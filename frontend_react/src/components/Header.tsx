import React from 'react';
import logo from '../assets/dp_logo.png'

function Header() {
	return (
	  <React.Fragment>
		<div className = "header_flex">
			<img src={logo} className="Header-logo" alt="logo" />
			{/*if condition: if user is logged in, add user icon in top right corner*/}
			<div className = "headline">MY<br/>PROFILE</div>
		</div>
	  </React.Fragment>
	);
  }

export default Header;