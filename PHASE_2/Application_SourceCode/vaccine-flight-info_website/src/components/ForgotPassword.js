import { Link } from "react-router-dom";
import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'
import Alert from 'react-bootstrap/Alert'
import { useAuth } from './contexts/AuthContext'

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
		if (emailRef.current.value.length < 4) {
			alert('Please enter your email address.');
			return;
		}
        try {
            setError('')
            setMessage('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage("Please check your inbox for the reset link")
        } catch {
            setError('Failed to send the reset link, Please check if the email is correct')
        }
        setLoading(false)
    }
		
	return (
		<div id="bg">
			<h1 id="tit">Destinated</h1>
			<div id="form_container">
				{error && <Alert variant="danger">{error}</Alert>}
                {message && <Alert variant="success">{message}</Alert>}
				<Form onSubmit={handleSubmit} id="login_form">

		          <Form.Group controlId="formBasicEmail">
		            <Form.Label>Email</Form.Label>
		            <Form.Control type="email" ref={emailRef} placeholder="Email" required />
		          </Form.Group>

		          <Button variant="warning" type="submit">
		            Reset Password
		          </Button>
		          <br/>
			        <div className="w-100 text-center mt-3">

                        <Link to="/login"> Login </Link>
                    </div>

		        </Form>
	        </div>

	        <Link to="/home"><Button id="backtohome" variant="warning" type="submit">
            	Back to home
          	</Button></Link>
		</div>

	);
}

