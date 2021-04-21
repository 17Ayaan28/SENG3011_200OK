import {Link} from "react-router-dom";
import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from './components/Firebase';

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

	onSubmit = event => {
		const { email, password } = this.state;
		console.log(this.props)
		this.props.firebase
			.doSignInWithEmailAndPassword(email, password)
			.then(() => {
				console.log('logged in!');
				this.setState({ ...INITIAL_STATE });
				localStorage.setItem("firebase", this.props.firebase)
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

const LogInForm = compose(
	withRouter,
	withFirebase,
)(LogInFormBase);

export default LogInPage;


