import { Link, useHistory } from "react-router-dom";
import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'
import Alert from 'react-bootstrap/Alert'
import { useAuth } from './contexts/AuthContext'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
	const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
		if (emailRef.current.value.length < 4) {
			alert('Please enter your email address.');
			return;
		}
		if (passwordRef.current.value.length.length < 4) {
			alert('Please enter a password.');
			return;
		}
        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
			alert('Successfully Logged in')
			history.push('/fp')
        } catch {
            setError('Failed to log in')
        }
        setLoading(false)
    }
		
	return (
		<div id="bg">
			<h1 id="tit">Destinated</h1>
			<div id="form_container">
				{error && <Alert variant="danger">{error}</Alert>}
				<Form onSubmit={handleSubmit} id="login_form">

		          <Form.Group controlId="formBasicEmail">
		            <Form.Label>Email</Form.Label>
		            <Form.Control type="email" ref={emailRef} placeholder="Email" required />
		          </Form.Group>

		          <Form.Group controlId="formBasicPassword">
		            <Form.Label>Password:</Form.Label>
		            <Form.Control type="password" ref={passwordRef} placeholder="Password" required />
		          </Form.Group>

		          <Button variant="warning" type="submit">
		            Log In
		          </Button>
		          <br/>
			        <Form.Text className="text-muted">
			          We'll never share your information with anyone without your permission.
			        </Form.Text>

		        </Form>
	        </div>

	        <Link to="/home"><Button id="backtohome" variant="warning" type="submit">
            	Back to home
          	</Button></Link>
			<div className="w-100 text-center mt-2">
               Need an account? <Link to="/register"> Sign Up </Link>
            </div>  
		</div>

	);
}




