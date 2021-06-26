import React from "react";
//import {Link} from "react-router-dom";
//import Page2 from "./Page2";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Navbar from '../components/Navbar'
import './TravelInfo.css'
import Cards from '../components/Cards'
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import convert from '../../country_convert.json';
import brands from '../../vaccine_brands.json';

class TravelInfo extends React.Component {

	state = {
		country: undefined,
		front_end_name: this.props.match.params.country,
		vaccines: []
	}

	componentDidMount() {
		const currentUser = localStorage.getItem('user')
        if(!currentUser) {
            this.props.history.push('/')
        }

		if(convert[this.props.match.params.country]) {
			this.setState({ front_end_name: convert[this.props.match.params.country]['front_end_name'] })
		} else {
			let string = this.state.front_end_name
			string = string[0].toUpperCase() + string.slice(1);
			this.setState({ front_end_name: string })
		}
		console.log('1');
		const country = this.props.match.params.country;
		console.log(country)
		this.setState({ country: this.props.location.display_country_name });

		let headers = new Headers();
		//headers.append('Content-Type', 'application/json');
		//headers.append('Accept', 'application/json');
		//headers.append('Authorization', 'Basic ' + base64.encode(username + ":" +  password));
		//headers.append('Origin','http://localhost:3000');


		Axios.get(
			'https://us-central1-upheld-booking-311217.cloudfunctions.net/country_vaccine?country_name=' + country,
			{
				mode: 'cors',
				method: 'get',
				//headers: headers,
				country_name: country
			}
		
		).then(
			res => {
				console.log(res.data.vaccines);
				this.setState({ vaccines: res.data.vaccines });
			}
		);
		
	}

	componentWillUnmount() {
		console.log('unmount');
    }


	render() {
		console.log("render");
				console.log(this.state.country);

		return (
			<>
			<Navbar />
			<div id='tr'>
			<div className="margin-90">
				<h1 id="travel_head">Vaccinations for Travel to {this.state.front_end_name}</h1>
				<br />
				<Link className = "topbtn" to={'/news/' + this.props.match.params.country}>
				<button className="btn btn-primary" type='button'>Outbreak News</button> 
				</Link>

				<Link className = "topbtn" to={'/restriction/' + this.props.match.params.country}>
				<button className="btn btn-primary" type='button'>Restriction</button> 
				</Link>
			</div>

			
		<div className="vaccine-table">
			

			<Table id="travel_table" striped bordered hover>
			<thead>
				<tr>
				<th>Disease</th>
				<th>CDC Advise</th>
				<th>Vaccine Name</th>
				</tr>
			</thead>
			<tbody>
				{this.state.vaccines.map((vaccine, index) => (
					<tr key={index}>
						<td>{vaccine['name']}</td>
						<td>{vaccine['recommendation']}</td>
						<td>{brands[vaccine['name']]}</td>
					</tr>
				))}
			</tbody>
			</Table>
		</div>
		</div>
		</>
		);
	}

}

export default TravelInfo;
