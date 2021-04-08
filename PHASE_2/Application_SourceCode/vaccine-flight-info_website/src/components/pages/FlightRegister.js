
import {Link} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from '../Navbar'
function FlightRegister() {

    return (
      <>
      <Navbar />
      <div className="margin-90">
        <p>
          
        </p>

        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Origin</Form.Label>
            <Form.Control placeholder="Travel Origin" />
            <Form.Text className="text-muted">
              We'll never share your travel information without permission.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Destination</Form.Label>
            <Form.Control  placeholder="Travel Destination" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Date and Time of Departure</Form.Label>
            <Form.Control placeholder="Time Of Departure" />
          </Form.Group>

          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Share Data with Airport Staff"/>
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </div>
      </>
    );

}

export default FlightRegister;