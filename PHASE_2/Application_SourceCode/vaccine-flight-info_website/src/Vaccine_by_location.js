import React, { useState } from "react";
import {Link} from "react-router-dom";
//import Page2 from "./Page2";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CountrySelect from 'react-bootstrap-country-select';
import './Vaccine_by_location.css';
import Navbar from './components/Navbar';
import convert from './country_convert.json';
import { withRouter } from 'react-router-dom';
import { withFirebase } from './components/Firebase';
import { compose } from 'recompose';


class VaccineBase extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          country: undefined
        }
    }

    handleSearch = () => {
      console.log(this.state.country['name']);
      console.log(convert);
      let country_name;
      const front_end_name = this.state.country['name'].toLowerCase();
      if(front_end_name === 'guernsey' || front_end_name === 'isle of man' || front_end_name === 'jersey') {
        country_name = 'united-kingdom';
      }
      
      if(front_end_name === 'heard island and macdonald islands') {
        country_name = 'austrlia'
      }

      if(front_end_name === 'vatican city state') {
        country_name = 'italy'
      }

      if(front_end_name in convert) {
        country_name = convert[front_end_name]['cdc_name']
      } else {
        country_name = this.state.country['name'].toLowerCase()
      }
      console.log(country_name)
      this.props.history.push({
        pathname: '/travelInfo?country=' + country_name,
        display_country_name: this.state.country['name']
    });
    }

    componentDidMount() {

      if(this.props.firebase.auth.currentUser === null) {
        this.props.history.push('/')
      }
      const dropdown = document.getElementById('country_input')
      dropdown.setAttribute('autocomplete', "off")
    }

    render() {
      return (
        <>
        <Navbar />
        <div>
          <p id='enter'>
            Enter the location you are travelling:
          </p>
          <br />
          <Form id="form">
            <Form.Group controlId="country_input">
              <Form.Label></Form.Label>
              <CountrySelect value={this.state.country} onChange={e => this.setState({ country: e })} autocomplete="off"/>
              <Form.Text className="text-muted">
                We'll never share your travel details with anyone else.
              </Form.Text>
            </Form.Group>

            <Button variant="primary" onClick={this.handleSearch}>Search</Button>

          </Form>
        </div>
        </>
      );
    }

}

const Vaccine = compose(
	  withRouter,
	  withFirebase,
)(VaccineBase);

export default Vaccine;