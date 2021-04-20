import {Link} from "react-router-dom";
import React from 'react';
import Button from 'react-bootstrap/Button';
import './home.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css'

function LandingPage() {

	return (
		<div id="a_photo">
		<h1 id="b_photo_text">Destinated</h1>
		<Link to="/register"><Button id="button1" variant="warning">Register</Button></Link>
		<Link to="/login"><Button id="button2" variant="warning">Login</Button></Link>
		</div>

	);
}

export default LandingPage;