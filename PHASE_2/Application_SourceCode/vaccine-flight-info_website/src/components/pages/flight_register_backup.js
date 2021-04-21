
import {Link} from "react-router-dom";
import React, { useState }from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Navbar from '../Navbar'
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Axios from "axios";
import { ThemeProvider } from "react-bootstrap";

class FlightRegister extends React.Component {

    constructor(props) {
        super(props);
      
        this.state = {
            dod: '',
            origin: '',
            destination: '',
            show: false,
            message: '',
            origin_icaos: [],
            destination_icaos: []
        };
    }

    handleSearch = () => {
      if(this.state.origin === "" || this.state.origin === null) {
          this.setState({ message: "Please provide an origin!" });
          this.setState({ show: true });
      } else if(this.state.destination === "" || this.state.destination === null) {
          this.setState({ message: "Please provide a destination!" });
          this.setState({ show: true });
      } else if(this.state.dod === '' || this.state.dod === null || this.state.dod < new Date()) {
          this.setState({ message: "Invalid Date of Depature" });
          this.setState({ show: true });
      } else {
          console.log('(((((((((');
          console.log(this.state.origin);
          console.log(this.state.destination);

          // get ICAO of origin
          const options1 = {
              method: 'GET',
              url: 'https://aerodatabox.p.rapidapi.com/airports/search/term',
              params: {q: this.state.origin, limit: '10'},
              headers: {
                'x-rapidapi-key': '2cf1a4a141msh66321b55ff7c5bfp13bc41jsn9f941faf9485',
                'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
              }
          };

          const options2 = {
              method: 'GET',
              url: 'https://aerodatabox.p.rapidapi.com/airports/search/term',
              params: {q: this.state.destination, limit: '5'},
              headers: {
                'x-rapidapi-key': '2cf1a4a141msh66321b55ff7c5bfp13bc41jsn9f941faf9485',
                'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
              }
          };
          
          const origin_request = Axios.request(options1)
          const destination_request = Axios.request(options2)

          const date = this.state.dod

          let month = String((date.getMonth() + 1))
          const pattern = /^[1-9]$/
          if(pattern.test(month)) {
              month = '0' + month
          }

          let fromTime1 = date.getFullYear() + '-' + month + '-' + date.getDate() + 'T00:00'
          let toTime1 = date.getFullYear() + '-' + month + '-' + date.getDate() + 'T12:00'
          let fromTime2 = date.getFullYear() + '-' + month + '-' + date.getDate() + 'T12:00'
          let toTime2 = date.getFullYear() + '/' + month + '/' + (date.getDate() + 1) + 'T00:00'


          Axios.all([origin_request, destination_request]).then(Axios.spread((...responses) => {
              const origin_response = responses[0]
              const destination_response = responses[1]
              console.log('""""""""""""""');
              console.log(origin_response.data.items);
              console.log(destination_response.data.items)

              const origin_icaos = origin_response.data.items
              const destination_icaos = destination_response.data.items
              for (let origin_icao of origin_icaos) {
                  const url1 = 'https://aerodatabox.p.rapidapi.com/flights/airports/icao/' + origin_icao['icao'] + '/' + fromTime1 + '/' + toTime1
                  const url2 = 'https://aerodatabox.p.rapidapi.com/flights/airports/icao/' + origin_icao['icao']+ '/' + fromTime2 + '/' + toTime2
                  const options11 = {
                      method: 'GET',
                      url: url1,
                      params: {
                          withLeg: 'true',
                          withCancelled: 'true',
                          withCodeshared: 'true',
                          withCargo: 'true',
                          withPrivate: 'true'
                      },
                      headers: {
                          'x-rapidapi-key': '2cf1a4a141msh66321b55ff7c5bfp13bc41jsn9f941faf9485',
                          'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
                      }
                  };

                  const options22 = {
                      method: 'GET',
                      url: url2,
                      params: {
                          withLeg: 'true',
                          withCancelled: 'true',
                          withCodeshared: 'true',
                          withCargo: 'true',
                          withPrivate: 'true'
                      },
                      headers: {
                          'x-rapidapi-key': '2cf1a4a141msh66321b55ff7c5bfp13bc41jsn9f941faf9485',
                          'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
                      }
                  };
                  const first_request = Axios.request(options11)
                  const second_request = Axios.request(options22)
                  console.log(url1)
                  let icaos_array = []
                  Axios.all([first_request], [second_request])
                  .then(Axios.spread((...responses) => {
                      let array = responses[0]['depatures'] + responses[1]['depatures']
                      for (let a of array) {
                          console.log(a['arrival']['airport'])
                          if('icao' in a['arrival']['airport']) {
                              icaos_array.push(a['arrival']['airport']['icao'])
                              console.log(a['arrival']['airport']['icao'])
                          }
                      }
                  })).catch(errors => {
                      console.log('fk fk fk')
                  })
            
              }
              // use/access the results 
          })).catch(errors => {
              console.log('error when requesting ICAO');
              console.log(errors)
              // react on errors.
          })
      }
    }

    handleClose = () => {
        this.setState({ show:false })
    }
    
    render() {
        return (
          <>
          <Navbar />
          <Card>
              <Card.Body>
                  <div>
                      <p>Origin</p>
                      <input type="text" 
                      onChange={e => this.setState({ origin: e.target.value })}
                      />
                  </div>
                  <div>
                      <p>Destination</p>
                      <input type="text"
                      onChange={e => this.setState({ destination: e.target.value })}
                      />
                  </div>
                  <div>
                      <p>Date of Depature</p>
                      <DatePicker
                        onChange={e => this.setState({ dod: e })}
                        value={this.state.dod}
                      />
                  </div>
                  <Button variant="warning" onClick={this.handleSearch}>Search</Button>
              </Card.Body>
          </Card>
          <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
              <Modal.Title></Modal.Title>
              </Modal.Header>
              <Modal.Body>{this.state.message}</Modal.Body>
              <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                  Close
              </Button>
              </Modal.Footer>
          </Modal>
          </>
        );
    }

}

export default FlightRegister;