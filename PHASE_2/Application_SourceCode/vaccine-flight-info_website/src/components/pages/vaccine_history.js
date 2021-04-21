import {Link} from "react-router-dom";
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Navbar from '../Navbar';
import './vaccine_history.css';
import FileBase64 from "react-file-base64";
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-date-picker';
import { InputGroup } from "react-bootstrap";
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

class Vaccine_history_base extends React.Component {

	constructor(props) {
		super(props);
	 
		this.state = {
			disease: '',
			vaccine_name: '',
			date: '',
			certificate: '',
			certificate_name: '',
			show: false,
			message: '',
			history: []
		};
	}


	handleFile = () => {
		const certificate = document.getElementById('certificate').files[0];

	}

	handleClose = () => {
		this.setState({ show: false });
	}

	handleSubmit = () => {
		//console.log(this.state.certificate)
		//const today = new Date()
		//console.log(today.getFullYear() + '/' + (today.getMonth() + 1)+ '/' + today.getDate());
		//const certificate = document.getElementById('certificate');


		let d = this.state.date
        let month = String((d.getMonth() + 1));
        const pattern = /^[1-9]$/
        if(pattern.test(month)) {
            month = '0' + month
        }
        let day = String(d.getDate());
        if(pattern.test(day)) {
          day = '0' + day
        }

        const year = String(d.getFullYear());

        const input_date = new Date(year+'-'+month+'-'+day)
        
        let today = new Date()
        const y = String(today.getFullYear())
        let m = String((today.getMonth() + 1));
        let dd = String(today.getDate());

        if(pattern.test(m)) {
            m = '0' + m
        }

        if(pattern.test(dd)) {
            dd = '0' + dd
        }

        today = new Date(y+'-'+m+'-'+dd)

		console.log('^^^^^^');
		const p1 = /\.pdf$/
		const p2 = /\.png$/
		const p3 = /\.jpg$/
		const p4 = /\.jpeg$/
		const file_name = this.state.certificate_name
		if(this.state.disease === '' || this.state.disease === null) {
			this.setState({ message:'Please fill all fields!' }, () => {
				this.setState({ show: true });
			});
		} else if (this.state.vaccine_name === '' || this.state.vaccine_name === null) {
			this.setState({ message:'Please fill all fields!' }, () => {
				this.setState({ show: true });
			});
		} else if (this.state.date === '' || this.state.date === null || input_date > today) {
			this.setState({ message: 'Date must be before today' }, () => {
				this.setState({ show: true });
			})
		} else if (this.state.certificate === '') {
			this.setState({ message: "Please upload a proof document" }, () => {
				this.setState({ show: true });
			})
		} else if (!p1.test(file_name) && !p2.test(file_name) && !p3.test(file_name) && !p4.test(file_name)) {
			this.setState({ message: "Unsupport file format!" }, () => {
				this.setState({ show: true });
			})
		} else {

			//console.log('inputs are correct')
			const uid = this.props.firebase.auth.currentUser.uid
			let new_record = {}
			new_record['disease'] = this.state.disease;
			new_record['vaccine_name'] = this.state.vaccine_name;
			let date = this.state.date;
			date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			new_record['date'] = date
			new_record['certificate'] = this.state.certificate
			console.log('heyyyy')
			console.log(new_record);

			const disease = this.state.disease;
			const vaccine_name = this.state.vaccine_name;
			const certificate = this.state.certificate;
			console.log('You are logging new vaccination record')
			const node_ref = this.props.firebase.db.ref(`v1/${uid}`).push()
			node_ref.set({
				disease,
				vaccine_name,
				date,
				certificate
			})
			.then(() => {
				console.log('new record is logged');
				this.setState({ message: "New record has been logged successfully!" }, () => {
					this.setState({ show: true });
				})
				//this.props.history.push('/home');
				const history = []
				const uid = this.props.firebase.auth.currentUser.uid
				const history_ref = this.props.firebase.db.ref(`v1/${uid}`);
				history_ref.on('value', (snapshot) => {
					snapshot.forEach((userSnapshot) => {
						//console.log('^^^^^^^^^^^');
						//console.log(userSnapshot.val())
						//console.log('^^^^^^^^^^^');
						const id = userSnapshot.key;
						const userData = userSnapshot.val();
						history.push(userData);
					});

					//console.log('#######');
					//console.log(history);
					//console.log('#######');
				})
				this.setState({ history: history });
					})
					.catch(error => {
						console.log(error);
						console.log('error when logging new records')
						this.setState({ error });
					});
			// first get arrays of historys
			/*
			let history = []
            const history_ref = this.props.firebase.db.ref(`v1/${uid}/history`);
			history_ref.on('value', (snapshot) => {
				snapshot.forEach((userSnapshot) => {
					const id = userSnapshot.key;
					const userData = userSnapshot.val();
					history.push(userData);
				});

				console.log('#######');
				console.log(history)


			})
			*/

		}


	}


	componentDidMount() {
		// get list of history
		const history = []
		const uid = this.props.firebase.auth.currentUser.uid
		const history_ref = this.props.firebase.db.ref(`v1/${uid}`);
		history_ref.on('value', (snapshot) => {
			snapshot.forEach((userSnapshot) => {
				console.log('^^^^^^^^^^^');
				console.log(userSnapshot.val())
				console.log('^^^^^^^^^^^');
				const id = userSnapshot.key;
				const userData = userSnapshot.val();
				history.push(userData);
			});

			console.log('#######');
			console.log(history);
			console.log('#######');
		})
		this.setState({ history: history });
	}

	showCertification(certificate) {
		var newWindow = window.open("_blank");
		newWindow.document.write("<img src=" + certificate + " height='' weight='' alt='' />")
	}


	render() {
		return (
			<>
			<Navbar />
			<br></br>
			<h1>Vaccination History</h1>
			<br></br>
			<div className="margin-90">
			<div className="margin-90">

				<Table striped bordered hover>
				<thead className="table" style={{backgroundColor: 'gray', color: 'white'}}>
					<tr>
					<th>#</th>
					<th>Disease Name</th>
					<th>Vaccine Name</th>
					<th>Date</th>
					<th>Proof Document</th>
					</tr>
				</thead>
				<tbody>
					{this.state.history.map((record, index) => (
						<tr>
							<td>{index + 1}</td>
							<td>{record.disease}</td>
							<td>{record.vaccine_name}</td>
							<td>{record.date}</td>
							<td><button type="button" className="btn btn-link" onClick={()=>this.showCertification(record.certificate)}>View</button></td>
						</tr>
					))}
				</tbody>
				</Table>
				<br></br>
				<div className="add_history">
				<h3 id="add_vaccine_head"> New Record</h3>
				<Form id="add_history_form">
				<Form.Group controlId="formDisease">
				<Form.Label>Disease: </Form.Label>
					<Form.Control placeholder="Disease"
					value = {this.state.disease}
					autoComplete="off"
					onChange={e => this.setState({ disease: e.target.value })}
					/>
				</Form.Group>

				<Form.Group controlId="formVaccine">
					<Form.Label>Vaccine Name:</Form.Label>
					<Form.Control  placeholder="Vaccine" 
					value={this.state.vaccine_name}
					autoComplete="off"
					onChange={e => this.setState({ vaccine_name: e.target.value })}
					/>
				</Form.Group>

				<Form.Group controlId="formDate">
					<Form.Label>Date:</Form.Label>
					<br />
					<DatePicker
						onChange={e => this.setState({ date: e })}
						value={this.state.date}
                    />
				</Form.Group>	
				<Form.Group controlId="formDate">
					<Form.Label>Upload Certificate:</Form.Label>
					<Form.Text>
						<p>Supported format: .pdf, .png, .jpg, .jpeg</p>
						<FileBase64
							multiple={false}
							onDone={x => {
							this.setState({ certificate: x.base64})
							this.setState({ certificate_name: x.name })
							console.log("x", x);
							}}
						/>
					</Form.Text>
				</Form.Group>
				<Button variant="warning"
				onClick = {this.handleSubmit}
				>
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
			<Modal show={this.state.show} onHide={this.handleClose}>
				<Modal.Header closeButton>
				<Modal.Title></Modal.Title>
				</Modal.Header>
				<Modal.Body>{this.state.message}</Modal.Body>
				<Modal.Footer>
				<Button variant="secondary" onClick={this.handleClose}>
					Close
				</Button>
				</Modal.Footer>
            </Modal>
			</>
		);
	}
}

const Vaccine_history = compose(
	withRouter,
	withFirebase,
)(Vaccine_history_base);

export default Vaccine_history;