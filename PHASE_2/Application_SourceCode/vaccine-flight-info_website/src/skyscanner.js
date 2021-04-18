import React from 'react';
import Axios from 'axios';


class skyscanner extends React.Component {

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

		//event.preventDefault();// change
		//https://cors-anywhere.herokuapp.com/
		Axios.get(
			"http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/FR/eur/en-US/PARI/NYC/2021-05-02?apiKey=prtl6749387986743898559646983194",
			{
				"headers": {
					"x-rapidapi-key": "0a96377de7msh3de3078377e3f3dp141743jsncf8d8b8800ae",
					"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
				}
			}
		
		).then((response)=> {
			console.log(response);
		}, (error) => {
			console.log(error);
		});


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

export default skyscanner;