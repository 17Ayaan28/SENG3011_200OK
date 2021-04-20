import React from 'react';
import Axios from 'axios';
//import cors from 'cors';

class Skyscanner extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			origin: '',
			destination: '',
			tod:'',
			api_data: []
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {

		const { name, value } = event.target;

		this.setState({
			[name]: value
		});
	}

	handleSubmit(event) {
		//console.log("hi");
		event.preventDefault();// change
		//https://cors-anywhere.herokuapp.com/
		Axios.get(
			"http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/FR/eur/en-US/PARI/NYC/2021-05-02?apiKey=prtl6749387986743898559646983194",
			{
				mode: 'cors',
				method: 'get',
			}
		
		).then((response)=> {
			//console.log(response);
			
			var joined = this.state.api_data.concat(response);
			this.setState({ api_data: joined });

			//console.log(this.state.api_data.length);

		}, (error) => {
			console.log(error);
		});
	
		console.log(this.state.api_data.length);
	}

	render() {
		return (
		  <form onSubmit={this.handleSubmit}>
			<label>
			  origin:
			  <input name='origin' ype="text" value={this.state.origin} onChange={this.handleChange} />
			</label>
			<label>
			  destination:
			  <input name='destination' type="text" value={this.state.destination} onChange={this.handleChange} />
			</label>
			<label>
			  tod:
			  <input name='tod' type="text" value={this.state.tod} onChange={this.handleChange} />
			</label>
			<input type="submit" value="Submit" />
		  </form>
		);
	  }

}

export default Skyscanner;
