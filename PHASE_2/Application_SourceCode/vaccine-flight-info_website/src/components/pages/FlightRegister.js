
import {Link} from "react-router-dom";
import React, { useState, forwardRef } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from '../Navbar'

import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';

function FlightRegister() {
    const [value, onChange] = useState(new Date());
    const [value1, Change] = useState('10:00');
    return (
      <>
      <Navbar />
      <div className="margin-90 flight-register">
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
            <Form.Label id="date-right">Date of Depature</Form.Label>
            <DatePicker className="datepicker_mobile"
            selected={startDate}
            onChange={date => setStartDate(date)}
            customInput={<ExampleCustomInput />}
            />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Label id="time-right">Time of Depature</Form.Label>
            <TimePicker className="timepicker-mobile"

                onChange={Change}
                value={value1}
            />
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