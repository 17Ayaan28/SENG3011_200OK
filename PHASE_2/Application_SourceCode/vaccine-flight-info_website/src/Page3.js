
import {Link} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Page3() {

    return (

      <div>
        <p>
          
        </p>

        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Origin</Form.Label>
            <Form.Control type="email" placeholder="Travel Origin" />
            <Form.Text className="text-muted">
              We'll never share your travel information without permission.
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Destination</Form.Label>
            <Form.Control type="password" placeholder="Travel Destination" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Destination</Form.Label>
            <Form.Control type="password" placeholder="Time Of Departure" />
          </Form.Group>

          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Share Data with Airport Staff"/>
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </div>
    );

}

export default Page3;