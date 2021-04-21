import {Link, withRouter } from "react-router-dom";
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './register.css'
import Alert from 'react-bootstrap/Alert';
import { withFirebase } from './components/Firebase';
import { compose } from 'recompose';

function shoot() {
	alert("Your account was successfully created.");
}

const INITIAL_STATE = {
	first_name: '',
	last_name: '',
	email: '',
	passwordOne: '',
	passwordTwo: '',
	passport_number: '',
	staff_id: '',
	checkUser: false,
	checkStaff: false,
	disableCheckUser: false,
	disableCheckStaff: false,
	error: null
};

const RegisterPage = () => (
	<div id="bg">
		<h1 id="thiss">Destinated</h1>
		<div id="form_container">
			<RegisterForm />

		</div>
		<Link to="/"><Button id="backtohome" variant="warning" type="submit">Back to home</Button></Link>
	</div>
);

class RegisterFormBase extends Component {

	constructor(props) {
		super(props);
	 
		this.state = { ...INITIAL_STATE };
	}

	onChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};

	onSubmit = (event) => {
		console.log('submit');
		const { first_name, last_name, email, passwordOne, passport_number, staff_id } = this.state;
		console.log(passport_number);

		
		this.props.firebase
		.doCreateUserWithEmailAndPassword(email, passwordOne)
		.then(authUser => {
			// Create a user in your Firebase realtime database
			let credential;
			let role;
			
			if(passport_number !== "" && passport_number !== null) {
				credential = passport_number
				role = 'USER'
			}

			if(staff_id !== "" && staff_id !== null) {
				credential = staff_id;
				role = "STAFF"
			}
			
			return this.props.firebase
			.user(authUser.user.uid)
			.set({
				first_name,
				last_name,
				email,
				credential,
				role
			});
			
		})
		.then(() => {
			console.log('registed');
			this.setState({ ...INITIAL_STATE });
			this.props.history.push('/home');
		})
		.catch(error => {
			console.log(error);
			console.log('error when registering')
			this.setState({ error });
		});
		
		event.preventDefault();
	}

	handleUser = () => {
		if(!this.state.checkUser) {
			this.setState({ disableCheckStaff: true });
			document.getElementById('passport_number').style.display = 'block';
		} else {
			this.setState({ disableCheckStaff: false });
			document.getElementById('passport_number').style.display = 'none';
		}
		this.setState({ checkUser: !this.state.checkUser });
	}

	handleStaff = () => {
		if(!this.state.checkStaff) {
			console.log('checked')
			this.setState({ disableCheckUser: true });
			document.getElementById('staff_id').style.display = 'block';
		} else {
			console.log('unchecked')
			this.setState({ disableCheckUser: false });
			document.getElementById('staff_id').style.display = 'none';
		}
		this.setState({ checkStaff: !this.state.checkStaff });
	}

	render () {

		const {
			first_name,
			last_name,
			email,
			passwordOne,
			passwordTwo,
			passport_number,
			staff_id,
			checkUser,
			checkStaff,
			disableCheckUser,
			disableCheckStaff,
			error
		} = this.state;


		const isInvalid =
		passwordOne !== passwordTwo ||
		passwordOne === '' ||
		email === '' ||
		last_name === '' ||
		first_name === '';

		return (
			
			<Form id="login_form">
			<Form.Group>
				<Form.Label>First Name:</Form.Label>
				<Form.Control name="first_name" value={first_name} onChange={this.onChange} placeholder="First Name" />

			</Form.Group>

			<Form.Group>
				<Form.Label>Last Name:</Form.Label>
				<Form.Control name="last_name" value={last_name} onChange={this.onChange} placeholder="Last Name" />
			</Form.Group>

			<Form.Group controlId="formBasicEmail">
				<Form.Label>Email</Form.Label>
				<Form.Control name="email" value={email} onChange={this.onChange} type="email"  placeholder="Email" />
			</Form.Group>

			<Form.Group controlId="formBasicPassword">
				<Form.Label>Password:</Form.Label>
				<Form.Control name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="Password" />
			</Form.Group>

			<Form.Group controlId="Confirm Password">
				<Form.Label>Confirm Password:</Form.Label>
				<Form.Control name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="password" placeholder="Confirm Password" />
			</Form.Group>

			<Form.Group controlId="formBasicCheckbox">
				<Form.Check type="checkbox" label="Share Data with Airport Staff"/>
			</Form.Group>
			<Form.Group controlId="formBasicCheckbox">
				<Form.Check id="user" disabled={disableCheckUser} type="checkbox" onChange={this.handleUser} 
				label="I am a normal user"/>
			</Form.Group>
			<Form.Group controlId="formBasicCheckbox">
				<Form.Check id="staff" disabled={disableCheckStaff} type="checkbox" onChange={this.handleStaff}
				label="I am an airport staff"/>
			</Form.Group>
			<Form.Group id='passport_number'>
				<Form.Label>Passport Number:</Form.Label>
				<Form.Control name="passport_number" value={passport_number} onChange={this.onChange} placeholder="Passport Number" />
			</Form.Group>
			<Form.Group id='staff_id'>
				<Form.Label>Staff ID:</Form.Label>
				<Form.Control name="staff_id" value={staff_id} onChange={this.onChange} placeholder="Staff ID" />
			</Form.Group>
			<Button onClick={this.onSubmit} variant="warning" type="submit" disabled={isInvalid}>
				Register
			</Button>

			<br/>
				<Form.Text className="text-muted">
				We'll never share your information with anyone without your permission.
				</Form.Text>
				{error && <p>{error.message}</p>}
			</Form>
				
		);
	}
}

const RegisterForm = compose(
	withRouter,
	withFirebase,
)(RegisterFormBase);;

export default RegisterPage;


