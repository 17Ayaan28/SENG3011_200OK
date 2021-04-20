import React from "react";
//import {Link} from "react-router-dom";
//import Page2 from "./Page2";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Navbar from './components/Navbar'
import './TravelInfo.css'
import Cards from './components/Cards'
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import convert from './country_convert.json';
import brands from './vaccine_brands.json';

class TravelInfo extends React.Component {

	state = {
		country: undefined,
		vaccines: []
	}

	componentDidMount() {
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
			'https://australia-southeast1-seng3011-306108.cloudfunctions.net/country_vaccine?country_name=' + country,
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
			<div className="margin-90">
				<h1 id="travel_head">Vaccinations for Travel to {this.props.match.params.country}</h1>
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
				{this.state.vaccines.map(vaccine => (
					<tr>
						<td>{vaccine['name']}</td>
						<td>{vaccine['recommendation']}</td>
						<td>{brands[vaccine['name']]}</td>
					</tr>
				))}
			</tbody>
			</Table>
		</div>
		</>
		);
	}

}

export default TravelInfo;
