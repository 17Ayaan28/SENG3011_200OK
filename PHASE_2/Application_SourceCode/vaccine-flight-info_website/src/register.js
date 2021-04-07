import {Link} from "react-router-dom";
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './register.css'
function register() {
	return (
		<div id="bg">
			<h1 id="thiss">Destinated</h1>
			<div id="form_container">
				<Form id="login_form">
		          <Form.Group controlId="formBasicEmail">
		            <Form.Label>First Name:</Form.Label>
		            <Form.Control placeholder="First Name" />

		          </Form.Group>

		          <Form.Group controlId="formBasicPassword">
		            <Form.Label>Last Name:</Form.Label>
		            <Form.Control  placeholder="Last Name" />
		          </Form.Group>

		          <Form.Group controlId="formBasicEmail">
		            <Form.Label>Email</Form.Label>
		            <Form.Control type="email"  placeholder="Email" />
		          </Form.Group>

		          <Form.Group controlId="formBasicPassword">
		            <Form.Label>Password:</Form.Label>
		            <Form.Control type="password" placeholder="Password" />
		          </Form.Group>

		           <Form.Group controlId="Confirm Password">
		            <Form.Label>Confirm Password:</Form.Label>
		            <Form.Control type="password" placeholder="Confirm Password" />
		          </Form.Group>

		          <Form.Group controlId="formBasicCheckbox">
		            <Form.Check type="checkbox" label="Share Data with Airport Staff"/>
		          </Form.Group>
		          <Button variant="warning" type="submit" href='/home'>
		            Register
		          </Button>
		          <br/>
			        <Form.Text className="text-muted">
			          We'll never share your information with anyone without your permission.
			        </Form.Text>

		        </Form>
	        </div>

	        <Link to="/fp"><Button id="backtohome" variant="warning" type="submit">Back to home</Button></Link>
		</div>

	);
}

export default register;


