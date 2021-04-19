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
		<h1>Vaccination History</h1>
		<br></br>
		<div className="margin-90">
		<div className="margin-90">

			<Table striped bordered hover>
			  <thead class="table" style={{backgroundColor: 'gray', color: 'white'}}>
			    <tr>
			      <th>#</th>
			      <th>Disease Name</th>
			      <th>Vaccine Name</th>
				  <th>Date</th>
			      <th>Proof Document</th>
			    </tr>
			  </thead>
			  <tbody>
			    <tr>
			      <td>1</td>
			      <td>Cholera</td>
			      <td>Dukoral</td>
				  <td>2019/12/05</td>
			      <td><a href="https://i.pinimg.com/originals/83/f1/67/83f167f885204677b2a61dc8ece029bd.jpg">Medical Certificate</a></td>
			    </tr>
			    <tr>
			      <td>2</td>
			      <td>Hepatitis-A</td>
			      <td>Avaxim</td>
				  <td>2020/01/18</td>
			      <td><a href="https://i.pinimg.com/originals/83/f1/67/83f167f885204677b2a61dc8ece029bd.jpg">Medical Certificate</a></td>
			    </tr>
			  </tbody>
			</Table>
			<br></br>
			<div className="add_history">
			<h3 id="add_vaccine_head"> New Record</h3>
			<Form id="add_history_form">
			<Form.Group controlId="formDisease">
			<Form.Label>Diseases: </Form.Label>
				<Form.Control placeholder="Disease" />
			</Form.Group>

			<Form.Group controlId="formVaccine">
				<Form.Label>Vaccine Name:</Form.Label>
				<Form.Control  placeholder="Vaccine" />
			</Form.Group>

			<Form.Group controlId="formDate">
				<Form.Label>Date:</Form.Label>
				<Form.Control  placeholder="yyyy/mm/dd" />
			</Form.Group>



			
			<Form.Group controlId="formDate">
				<Form.Label>Upload Certificate:</Form.Label>
				<Form.Text><input type="file" accept=".pdf,.jpg,.jpeg,.png"/></Form.Text>
			</Form.Group>


	
			<Button variant="warning" type="submit">
				Submit Record
			</Button>

			
			<br/>
				<Form.Text className="text-muted">
				We'll never share your information with anyone without your permission.
				</Form.Text>
			</Form>

			</div>
		</div>
		</div>
        </>
	);
}

export default vaccine_history;