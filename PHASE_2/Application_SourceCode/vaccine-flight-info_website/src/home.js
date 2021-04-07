import {Link} from "react-router-dom";
import React from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function home() {
	return (
		<div id="a">

		<h1 id="b">Destinated</h1>
		<Link to="/register"><Button id="button1" variant="warning">Register</Button></Link>
		<Link to="/login"><Button id="button2" variant="warning">Login</Button></Link>
		</div>

	);
}

export default home;