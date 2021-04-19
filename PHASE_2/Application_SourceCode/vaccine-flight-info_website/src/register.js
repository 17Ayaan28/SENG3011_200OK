import { Link, useHistory } from "react-router-dom";
import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css'
import Alert from 'react-bootstrap/Alert'
import { useAuth } from './contexts/AuthContext'

export default function Register() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
	const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }
		if (emailRef.current.value.length < 4) {
			alert('Please enter an email address.');
			return;
		}
		if (passwordRef.current.value.length.length < 4) {
			alert('Please enter a password.');
			return;
		}
        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
			alert('Congraduations, You have now Signed in')
			history.push('/fp')
        } catch {
            setError('Failed to sign up')
        }
        setLoading(false)
    }
	
		return (
			<div id="bg">
				<h1 id="thiss">Destinated</h1>
				<div id="form_container">
					{error && <Alert variant="danger">{error}</Alert>}
					<Form onSubmit={handleSubmit} id="login_form">
						<Form.Group controlId="formBasicFirstName">
							<Form.Label>First Name:</Form.Label>
							<Form.Control placeholder="First Name" />

						</Form.Group>

						<Form.Group controlId="formBasicLastName">
							<Form.Label>Last Name:</Form.Label>
							<Form.Control  placeholder="Last Name" />
						</Form.Group>

						<Form.Group controlId="formBasicEmail">
							<Form.Label>Email:</Form.Label>
							<Form.Control type="email" ref={emailRef} placeholder="Email" required />
						</Form.Group>

						<Form.Group controlId="formBasicPhoneNumber">
							<Form.Label>Phone No.:</Form.Label>
							<Form.Control type="phone#"  placeholder="Phone Number" />
						</Form.Group>

						<Form.Group controlId="formBasicPassport">
							<Form.Label>Passport No.:</Form.Label>
							<Form.Control type="passport#"  placeholder="Passport Number" />
						</Form.Group>

						<Form.Group controlId="formBasicPassword">
							<Form.Label>Password:</Form.Label>
							<Form.Control type="password" ref={passwordRef} placeholder="Password" required />
						</Form.Group>

						<Form.Group controlId="Confirm Password">
							<Form.Label>Confirm Password:</Form.Label>
							<Form.Control type="password" ref={passwordConfirmRef} placeholder="ConfirmPassword" required />
						</Form.Group>

						<Form.Group controlId="formBasicCheckbox">
							<Form.Check type="checkbox" label="Share Data with Airport Staff" checked/>
						</Form.Group>
						<Button disabled={loading} type="submit">
							Register
						</Button>
						{error && <Alert variant="danger">{error}</Alert>}

						<br/>
							<Form.Text className="text-muted">
							We'll never share your information with anyone without your permission.
							</Form.Text>

					</Form>
				</div>

				<Link to="/home"><Button id="backtohome" variant="warning" type="submit">Back to home</Button></Link>
			</div>
		)
	
}


