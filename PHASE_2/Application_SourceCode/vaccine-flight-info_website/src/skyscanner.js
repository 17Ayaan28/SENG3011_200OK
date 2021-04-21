import React from 'react';
import Axios from 'axios';
import './skyscanner.css';
import Navbar from './components/Navbar';
import Table from 'react-bootstrap/Table';




class Skyscanner extends React.Component {


	constructor(props) {
		super(props)
		this.state = {
			origin: '',
			destination: '',
			tod:'',
			api_data: '',
			carriers: [],
			flights:[],
			places:[]

		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleapi_data = this.handleapi_data.bind(this);

	}

	handleChange(event) {

		const { name, value } = event.target;

		this.setState({
			[name]: value
		});
	}

	handleapi_data(){
		// console.log(this.state.api_data);
		
		this.setState({
			carriers: [],
			flights:[],
			places:[]
		});

		for(var i = 0; i < this.state.api_data.Quotes.length; i++) {

			var jso = {
				tod: "",
				carriers: [],
				origin: 0,
				destination: 0
			}
	
			jso.tod = this.state.api_data.Quotes[i].OutboundLeg.DepartureDate;
			jso.origin = this.state.api_data.Quotes[i].OutboundLeg.OriginId;
			jso.destination = this.state.api_data.Quotes[i].OutboundLeg.DestinationId;
			jso.carriers = this.state.api_data.Quotes[i].OutboundLeg.CarrierIds
	
			this.state.flights.push(jso);
			
		}

		for(var j = 0; j < this.state.api_data.Carriers.length; j++){
			this.state.carriers.push(this.state.api_data.Carriers[j]);
		}

		for(var k = 0; k < this.state.api_data.Places.length; k++){

			this.state.places.push(this.state.api_data.Places[k]);
			
		}

		for (var f = 0; f < this.state.flights.length; f++){

			for (var n = 0; n < this.state.places.length; n++){
	
				if(this.state.flights[f].origin === this.state.places[n].PlaceId){
					this.state.flights[f].origin = this.state.places[n].Name;
				}
	
				if(this.state.flights[f].destination === this.state.places[n].PlaceId){
					this.state.flights[f].destination = this.state.places[n].Name;
				}
			}
		}

		for (var f = 0; f < this.state.flights.length; f++){

			for (var n = 0; n < this.state.carriers.length; n++){
	
				// console.log(this.state.carriers[n].Name);
				if(this.state.flights[f].carriers == this.state.carriers[n].CarrierId){
					this.state.flights[f].carriers = this.state.carriers[n].Name;
				}
			}
		}

		for (var t = 0; t < this.state.flights.length; t++){
    		//console.log(this.state.flights[t]);
    	}

		this.setState({

		});
	}


	handleSubmit(event) {
		//console.log("hi");
		event.preventDefault();// change
		//https://cors-anywhere.herokuapp.com/
		Axios.get(
			"http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/FR/eur/en-US/" + this.state.origin + "/" + this.state.destination + "/" + this.state.tod + "?apiKey=prtl6749387986743898559646983194",

			{
				mode: 'cors',
				method: 'get',
			}
		
		).then((response)=> {
			//console.log(response);
			
			//var joined = this.state.api_data.concat(response);
			this.setState({ api_data: response.data });
			this.handleapi_data();


		}, (error) => {
			console.log(error);
		});
	

	}

	render() {
		return (
			<div>
				<Navbar />
				<div className="scanner-container">
					<form onSubmit={this.handleSubmit}>
						<div class="row">
							<div class="col">
								<input class='form-control' placeholder="origin" name='origin' ype="text" value={this.state.origin} onChange={this.handleChange} />
							</div>
							<div class="col">
								<input class='form-control' placeholder="destination" name='destination' type="text" value={this.state.destination} onChange={this.handleChange} />
							</div>
							<div class="col">
								<input class='form-control' placeholder="date of departure" name='tod' type="text" value={this.state.tod} onChange={this.handleChange} />
							</div>
							<div class="col-1">
								<button type="submit" class="btn btn-primary">Search</button>
							</div>
						</div>
					</form>

					<div className="flight-table">
						<Table striped bordered hover>
							<thead>
								<tr>
								<th>Date</th>
								<th>Origin</th>
								<th>Destination</th>
								<th>Carriers</th>
								</tr>
							</thead>
							<tbody>
								{this.state.flights.map(flight => (
								<tr>
									<td>{flight['tod']}</td>
									<td>{flight['origin']}</td>
									<td>{flight['destination']}</td>
									<td>{flight['carriers']}</td>
								</tr>
								))}
							</tbody>
						</Table>
					</div>
				</div>
			</div>
		);
	}

}

export default Skyscanner;
