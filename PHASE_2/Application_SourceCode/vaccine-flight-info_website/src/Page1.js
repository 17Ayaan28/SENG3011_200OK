import React, { useState } from "react";
import {Link} from "react-router-dom";
//import Page2 from "./Page2";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CountrySelect from 'react-bootstrap-country-select';

function Page1() {

    const [ value, setValue ] = useState(null);
    return (

      <div>
        <p>
          Enter the location you are travelling to and any stop overs on the way:
        </p>

        <br>
        </br>
        <br></br>
        <br></br>
        <Form id="form">
          <Form.Group controlId="formBasicEmail">
            <Form.Label></Form.Label>
            <CountrySelect value={value} onChange={setValue}/>
            <Form.Text className="text-muted">
              We'll never share your travel details with anyone else.
            </Form.Text>
          </Form.Group>

          <Link to="/Page2"><Button variant="primary" type="submit">Search</Button></Link>

          <Link to="/Page3"><Button variant="primary" type="submit">ok</Button></Link>

          <Link to="/Page4"><Button variant="primary" type="submit">ok</Button></Link>
           
        </Form>
      </div>
    );

}

export default Page1;