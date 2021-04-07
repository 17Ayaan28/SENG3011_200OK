import {Link} from "react-router-dom";
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css'

function login() {
	return (
		<div id="bg">
			<h1 id="tit">Destinated</h1>
			<div id="form_container">
				<Form id="login_form">

		          <Form.Group controlId="formBasicEmail">
		            <Form.Label>Email</Form.Label>
		            <Form.Control type="Email" placeholder="Email" />
		          </Form.Group>

		          <Form.Group controlId="formBasicPassword">
		            <Form.Label>Password:</Form.Label>
		            <Form.Control type="password" placeholder="Password" />
		          </Form.Group>

		          <Form.Group controlId="formBasicCheckbox">
		            <Form.Check type="checkbox" label="Share Data with Airport Staff"/>
		          </Form.Group>
		          <Button variant="warning" type="submit" href='/home'>
		            Log In
		          </Button>
		          <br/>
			        <Form.Text className="text-muted">
			          We'll never share your information with anyone without your permission.
			        </Form.Text>

		        </Form>
	        </div>

	        <Link to="/fp"><Button id="backtohome" variant="warning" type="submit">
            	Back to home
          	</Button></Link>
		</div>

	);
}

export default login;


