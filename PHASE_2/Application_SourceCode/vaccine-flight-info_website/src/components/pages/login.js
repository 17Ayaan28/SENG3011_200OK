import {Link} from "react-router-dom";
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../components/Firebase';
import store from './reducers/store';
import { connect } from 'react-redux';
import Firebase from '../components/Firebase/firebase'
//import add_firebase from './reducers/reducer';


const LogInPage = () => (
	<div id="bg">
		<h1 id="tit">Destinated</h1>
		<div id="form_container">
			<LogInForm />
		</div>

		<Link to="/"><Button id="backtohome" variant="warning" type="submit">
			Back to home
		</Button></Link>
	</div>
);

const INITIAL_STATE = {
	email: '',
	password: '',
	error: null,
};

class LogInFormBase extends Component {

	constructor(props) {
		super(props);
	 
		this.state = { ...INITIAL_STATE };
	}

	onSubmit = async(event) => {
		const { email, password } = this.state;
		//console.log(this.props)
		Firebase.doSignInWithEmailAndPassword(email, password)
			.then(() => {
				console.log('logged in!');
				this.setState({ ...INITIAL_STATE });
				//this.props.add(this.props.firebase)
				localStorage.setItem("user", this.props.firebase.auth.currentUser.uid)
				/*
				const user_role_ref = Firebase.database().ref(`users/${this.props.firebase.auth.currentUser.uid}/role`);
				let role;
				user_role_ref.on('value', (snapshot) => {
					role = snapshot.val();
					localStorage.setItem('role', role)
					//console.log('role')
					
					if(role === "USER") {
						document.getElementById('staff_visible_only').style.display = 'none'
						const user_components = document.getElementsByClassName('user_visible_only')
						for (let c of user_components) {
							c.style.display = 'inline';
						}
					} else {
						document.getElementById('staff_visible_only').style.display = 'inline';
						const user_components = document.getElementsByClassName('user_visible_only');
						for (let c of user_components) {
							c.style.display = 'none';
						}
					}
					
				});
				*/
				//localStorage.setItem('role', )
				this.props.history.push('/home');
			})
			.catch(error => {
				console.log('fking error');
				console.log(error);
				this.setState({ error });
			});
	 
		event.preventDefault();
	};
	
	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render () {
		const {
			email,
			password,
			error,
		} = this.state;
		return (
			
			<Form id="login_form">

			<Form.Group controlId="formBasicEmail">
				<Form.Label>Email</Form.Label>
				<Form.Control name="email" value={email} onChange={this.onChange} type="Email" placeholder="Email" />
			</Form.Group>

			<Form.Group controlId="formBasicPassword">
				<Form.Label>Password:</Form.Label>
				<Form.Control name="password" value={password} onChange={this.onChange} type="password" placeholder="Password" />
			</Form.Group>
			<Button variant="warning" type="submit" onClick={this.onSubmit}>
				Log In
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

function add_f(firebase) {
	return {
		type: 'LOG_IN',
		payload: firebase
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
	  add: (firebase) => {
		dispatch(add_f(firebase))
	  }
	}
}

const LogInForm = compose(
	withRouter,
	withFirebase,
)(LogInFormBase);

export default LogInPage;


