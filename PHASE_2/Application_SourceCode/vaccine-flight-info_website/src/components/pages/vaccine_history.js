import {Link} from "react-router-dom";
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Navbar from '../Navbar'

function vaccine_history() {
	return (
        <>
        <Navbar />
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
			      <td>Medical Certificate</td>
			    </tr>
			    <tr>
			      <td>2</td>
			      <td>Hepatitis-A</td>
			      <td>Avaxim</td>
			      <td>Medical Certificate</td>
			    </tr>
			  </tbody>
			</Table>
            <Form>
			<Form.Group controlId="formBasicEmail">
	          <Form.Label>Diseases to be vaccinated against: </Form.Label>
	            <Form.Control placeholder="Disease" />
	          </Form.Group>

	          <Form.Group controlId="formBasicEmail">
	            <Form.Label>Vaccine Name:</Form.Label>
	            <Form.Control  placeholder="Vaccine" />
	          </Form.Group>

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