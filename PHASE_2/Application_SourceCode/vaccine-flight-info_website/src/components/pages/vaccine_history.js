import {Link} from "react-router-dom";
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Navbar from '../Navbar'
import './vaccine_history.css'

function vaccine_history() {
	return (
        <>
        <Navbar />
		<br></br>
		<h1>Diseases the user is vaccinated against:</h1>
		<br></br>
		<div>
			<Table striped bordered hover>
			  <thead>
			    <tr>
			      <th>#</th>
			      <th>Disease Name</th>
			      <th>Vaccine Name</th>
			      <th>Proof Document</th>
			    </tr>
			  </thead>
			  <tbody>
			    <tr>
			      <td>1</td>
			      <td>Cholera</td>
			      <td>Dukoral</td>
			      <td><a href="https://i.pinimg.com/originals/83/f1/67/83f167f885204677b2a61dc8ece029bd.jpg">Medical Certificate</a></td>
			    </tr>
			    <tr>
			      <td>2</td>
			      <td>Hepatitis-A</td>
			      <td>Avaxim</td>
			      <td><a href="https://i.pinimg.com/originals/83/f1/67/83f167f885204677b2a61dc8ece029bd.jpg">Medical Certificate</a></td>
			    </tr>
			  </tbody>
			</Table>
			<br></br>
			
			<h2 id="add_vaccine_head">Add New Vaccine:</h2>
			<br></br>
			<br></br>
            <Form id="add_history_form">
			<Form.Group controlId="formBasicEmail">
	          <Form.Label>Diseases to be vaccinated against: </Form.Label>
	            <Form.Control type="Email" placeholder="Disease" />
	          </Form.Group>

	          <Form.Group controlId="formBasicEmail">
	            <Form.Label>Vaccine Name:</Form.Label>
	            <Form.Control type="Email" placeholder="Vaccine" />
	          </Form.Group>

			  <Button variant="primary" type="submit">+</Button>
			  <h6 id="file_upload_text">Upload File</h6>

			  
			  <br></br>

	          <Form.Group controlId="">
	            <Form.Check type="checkbox" label="Share Data with Airport Staff"/>
	          </Form.Group>
	          <Button variant="warning" type="submit">
	            Add vaccine to list
	          </Button>

			  
	          <br/>
		        <Form.Text className="text-muted">
		          We'll never share your information with anyone without your permission.
		        </Form.Text>
		    </Form>
		</div>
        </>
	);
}

export default vaccine_history;