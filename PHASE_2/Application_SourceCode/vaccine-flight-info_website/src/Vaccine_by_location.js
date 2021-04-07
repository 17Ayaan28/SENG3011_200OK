import React, { useState } from "react";
import {Link} from "react-router-dom";
//import Page2 from "./Page2";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CountrySelect from 'react-bootstrap-country-select';
import './Vaccine_by_location.css'
import Navbar from './components/Navbar'

function Vaccine() {

    const [ value, setValue ] = useState(null);
    return (
      <>
      <Navbar />
      <div>
        <p id='enter'>
          Enter the location you are travelling:
        </p>
        <br />
        <Form id="form">
          <Form.Group controlId="formBasicEmail">
            <Form.Label></Form.Label>
            <CountrySelect value={value} onChange={setValue}/>
            <Form.Text className="text-muted">
              We'll never share your travel details with anyone else.
            </Form.Text>
          </Form.Group>

          <Link to="/travelInfo"><Button variant="primary" type="submit">Search</Button></Link>

        </Form>
      </div>
      </>
    );

}

export default Vaccine;