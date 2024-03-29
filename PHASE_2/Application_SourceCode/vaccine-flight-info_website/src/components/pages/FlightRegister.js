import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import Button from 'react-bootstrap/Button';
import Navbar from '../Navbar'
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Axios from "axios";
import Autosuggest from "react-autosuggest";
import './FlightRegister.css';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import code_to_name from '../../country_code.json';
import './DatePicker.css'
import Firebase from '../Firebase/firebase'

function syncDelay(milliseconds){
    var start = new Date().getTime();
    var end=0;
    while( (end-start) < milliseconds){
        end = new Date().getTime();
    }
}

function unique (arr) {
  return Array.from(new Set(arr))
}

class FlightRegisterBase extends React.Component {

    constructor(props) {
        super(props);
      
        this.state = {
            dod: new Date(),
            origin: '',
            destination: '',
            show: false,
            message: '',
            origin_icaos: [],
            destination_icaos: [],
            origin_suggestions: [],
            destination_suggestions: [],
            value: '',
            other_flights: [],
            direct_flights: [],
            look_up: {},
            look_up_code: {}
        };
    }


    handleClose = () => {
        this.setState({ show:false })
    }

    getOriginSuggestions = async (value) => {
  
        const inputValue = value.trim().toLowerCase();
        console.log(inputValue)
        if(inputValue && inputValue.length >= 5) {
            
            const options = {
                method: 'GET',
                url: 'https://aerodatabox.p.rapidapi.com/airports/search/term',
                params: {q: inputValue, limit: '5'},
                headers: {
                  'x-rapidapi-key': '5e9d5ed709mshf19dfc26bf7d57cp16d054jsn84dd9ffba92f',
                  'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
                }
            };
            
            //https://www.air-port-codes.com/api/v1/autocomplete?term=albania&limit=5
            // "Not a valid API Key/referrer domain combination. Please ensure you have added 'localhost:3000' to your AIR-PORT-CODES domain setting in your account and ensure you are using the proper API Key."
            /*
            const options = {
                method: 'POST',
                url: 'https://www.air-port-codes.com/api/v1/autocomplete',
                params: {term: inputValue, limit: '5'},
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'APC-Auth': '49932c28b0'
                }
              }
            */
            let response = await Axios.request(options);
            //console.log(response)
            let data = await response.data.items
            //console.log('json');
            //console.log(data);
            return data;
        } else {
           return []
        }
    };

    onOriginSuggestionsFetchRequested = ({ value }) => {
        this.getOriginSuggestions(value)
        .then(data => {
            if (data.Error) {
                this.setState({
                    origin_suggestions: []
                });
            } else {
                this.setState({
                    origin_suggestions: data
                });
            }
        })
    };

    onOriginSuggestionsClearRequested = () => {
        this.setState({
            origin_suggestions: []
        });
    };

    getOriginSuggestionValue = suggestion =>  suggestion.name + ' (' + suggestion.iata + ')';

    renderOriginSuggestion = suggestion => (
        <span className="sugg-option">
            <span className="name">
                {suggestion.name + ' (' + suggestion.iata + ')'}
            </span>
        </span>
    );
    

    onOriginChange = (event, { newValue }) => {
        this.setState({
            origin: newValue
        });
    };

    getDestinationSuggestions = async (value) => {
  
      const inputValue = value.trim().toLowerCase();
      console.log(inputValue)
      if(inputValue && inputValue.length >= 5) {
          const options = {
              method: 'GET',
              url: 'https://aerodatabox.p.rapidapi.com/airports/search/term',
              params: {q: inputValue, limit: '5'},
              headers: {
                'x-rapidapi-key': '13f01b6e68msh9b62bb9162e56d2p148578jsn9b4ca891e37c',
                'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
              }
          };

          let response = await Axios.request(options);
          //console.log(response)
          let data = await response.data.items
          //console.log('json');
          //console.log(data);
          return data;
      } else {
         return []
      }
  };

    onDestinationSuggestionsFetchRequested = ({ value }) => {
        this.getDestinationSuggestions(value)
        .then(data => {
            if (data.Error) {
                this.setState({
                    destination_suggestions: []
                });
            } else {
                this.setState({
                    destination_suggestions: data
                });
            }
        })
    };

    onDestinationSuggestionsClearRequested = () => {
        this.setState({
            destination_suggestions: []
        });
    };

    getDestinationSuggestionValue = suggestion =>  suggestion.name + ' (' + suggestion.iata + ')';

    renderDestinationSuggestion = suggestion => (
        <span className="sugg-option">
            <span className="name">
                {suggestion.name + ' (' + suggestion.iata + ')'}
            </span>
        </span>
    );
    

    onDestinationChange = (event, { newValue }) => {
        this.setState({
            destination: newValue
        });
    };

    handleSearch = () => {
        console.log(this.state.dod)
        console.log(new Date())
        let d = this.state.dod
        let month = String((d.getMonth() + 1));
        const pattern = /^[1-9]$/
        if(pattern.test(month)) {
            month = '0' + month
        }
        let day = String(d.getDate());
        if(pattern.test(day)) {
          day = '0' + day
        }

        const year = String(d.getFullYear());

        const input_date = new Date(year+'-'+month+'-'+day)
        
        let today = new Date()
        const y = String(today.getFullYear())
        let m = String((today.getMonth() + 1));
        let dd = String(today.getDate());

        if(pattern.test(m)) {
            m = '0' + m
        }

        if(pattern.test(dd)) {
            dd = '0' + dd
        }

        today = new Date(y+'-'+m+'-'+dd)




        if(this.state.origin === '' || this.state.origin === null) {
            this.setState({ message: "Please enter your origin!" }, () => {
              this.setState({ show:true })
            });
            //this.setState({ message: "Please enter your origin!" });
        } else if(this.state.destination === '' || this.state.destination === null) {
            this.setState({ message: "Please enter your destination!" }, () => {
              this.setState({ show:true })
            }); 
        } else if(this.state.dod === '' || this.state.dod === null || input_date < today) {
            this.setState({ message: "Invalid date of depature!" }, ()=>{
              this.setState({ show: true})
            })
        } else {
            if(this.state.origin === '' || this.state.origin === '') {
                this.setState({ message: "Please select airport names from the dropdown list" }, () => {
                    this.setState({ show: true })
                }) 
            } else {

                let origin_iata = this.state.origin.split('(')[1];
                let destination_iata = this.state.destination.split('(')[1];
                origin_iata = origin_iata.split(')')[0];
                destination_iata = destination_iata.split(')')[0];
                console.log(origin_iata);
                console.log(destination_iata);

                let month = String((this.state.dod.getMonth() + 1));
                const pattern = /^[1-9]$/
                if(pattern.test(month)) {
                    month = '0' + month
                }
                // 'X-Originating-IP': '103.116.73.18'
                // https://api.lufthansa.com/v1/operations/schedules/ZRH/FRA/2021-04-22?directFlights=1&limit=100
                const date = this.state.dod.getFullYear() + '-' + month + '-' + this.state.dod.getDate();
                const url = 'https://api.lufthansa.com/v1/operations/schedules/' + origin_iata + '/' + destination_iata + '/' + date + '?directFlights=0&limit=100';
                console.log(url);
                const options = {
                    method: 'GET',
                    url: url,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer r6tvfxkxp5m73p7cyx9wzpt5'
                    }
                }
        
                Axios.request(options)
                .then(
                    res => {
                        console.log('hehehehe');
                        let direct_array = []
                        let other_array = []
                        //console.log(res.data.ScheduleResource.Schedule);
                        const schedules = res.data.ScheduleResource.Schedule;
                        let direct_flights_array = []
                        let other_flights_array = []
                        for (let schedule of schedules) {
                            if(schedule['Flight'].length > 1) {
                              other_flights_array.push(schedule['Flight'])
                            } else {
                              direct_flights_array.push(schedule['Flight'])
                            }
                        }

                        let requests = []
                        let direct_requests = []
                        //console.log('Direct', direct_flights_array)
                        this.setState({ other_flights: other_flights_array })
                        this.setState({ direct_flights: direct_flights_array })
                        //console.log(direct_flights_array)
                        //console.log(other_flights_array)
                        for (let flight of direct_flights_array) {
                            if(!(this.state.look_up.hasOwnProperty(flight.Arrival.AirportCode))) {
                                direct_array.push(flight.Arrival.AirportCode)
                                //direct_requests.push(Axios.request(o))
                            }
                            if(!(this.state.look_up.hasOwnProperty(flight.Departure.AirportCode))) {
                                direct_array.push(flight.Departure.AirportCode)

                                //direct_requests.push(Axios.request(o))
                            }
                        }
                        for (let flight of other_flights_array) {
                            for (let stop of flight) {
                                //console.log(stop)
                                //console.log(stop.Arrival.AirportCode)
                                //console.log(this.state.look_up)
                                if(!(this.state.look_up.hasOwnProperty(stop.Arrival.AirportCode))) {
                                    //console.log('hi')
                                    other_array.push(stop.Arrival.AirportCode)
                                    //requests.push(Axios.request(o))
                                }
                                if(!(this.state.look_up.hasOwnProperty(stop.Departure.AirportCode))) {
                                    //console.log('hi')
                                    
                                    other_array.push(stop.Departure.AirportCode)
                                    //requests.push(Axios.request(o))
                                }
                                
                            }
                        }

                        direct_array = unique(direct_array)
                        other_array = unique(other_array)
      
                        for (let code of direct_array) {
                            /*
                            const o = {
                                method: 'GET',
                                url: 'https://aerodatabox.p.rapidapi.com/airports/iata/' + code,
                                headers: {
                                  'x-rapidapi-key': '13f01b6e68msh9b62bb9162e56d2p148578jsn9b4ca891e37c',
                                  'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
                                }
                            };
                            */
                            const o = {
                              method: 'GET',
                              url: 'https://airport-info.p.rapidapi.com/airport',
                              params: {iata: code},
                              headers: {
                                'x-rapidapi-key': '13f01b6e68msh9b62bb9162e56d2p148578jsn9b4ca891e37c',
                                'x-rapidapi-host': 'airport-info.p.rapidapi.com'
                              }
                            };

                            direct_requests.push(Axios.request(o))
                        }

                        for (let code of other_array) {
                            /*
                            const o = {
                                method: 'GET',
                                url: 'https://aerodatabox.p.rapidapi.com/airports/iata/' + code,
                                headers: {
                                  'x-rapidapi-key': '9abdef2831msh79570a94fb5badbp1de831jsnd17d1e83bbbe',
                                  'x-rapidapi-host': 'aerodatabox.p.rapidapi.com'
                                }
                            };
                            */
                            const o = {
                              method: 'GET',
                              url: 'https://airport-info.p.rapidapi.com/airport',
                              params: {iata: code},
                              headers: {
                                'x-rapidapi-key': '2690296570msh711e29b89c07d10p1034a8jsn4573e8e52b85',
                                'x-rapidapi-host': 'airport-info.p.rapidapi.com'
                              }
                            };

                            requests.push(Axios.request(o))
                        }



                        Axios.all(requests)
                        .then(
                            Axios.spread((...responses) => {
                                for (let response of responses) {
                                    //console.log(response)
                                    let table1 = this.state.look_up
                                    let table2 = this.state.look_up_code
                                    table1[response.data['iata']] = response.data['name']
                                    table2[response.data['iata']] = response.data['country_iso']
                                    this.setState({ look_up: table1 })
                                    this.setState({ look_up_code: table2 })
                                    //console.log('^^^^^^^^^^^^^')
                                    //console.log(table)
                                }
                            })
                        ).catch(errors => {
                            console.log(errors)
                            console.log('fk fk fk')
                        });
                        

                        Axios.all(direct_requests)
                        .then(
                            Axios.spread((...responses) => {
                                for (let response of responses) {
                                    //console.log(response)
                                    let table1 = this.state.look_up
                                    let table2 = this.state.look_up_code
                                    table1[response.data['iata']] = response.data['name']
                                    table2[response.data['iata']] = response.data['country_iso']
                                    this.setState({ look_up: table1 })
                                    this.setState({ look_up_code: table2 })
                                    //console.log('^^^^^^^^^^^^^')
                                    //console.log(table)
                                }
                            })
                        ).catch(errors => {
                            console.log('fk fk fk')
                        });
                        

                        //console.log(other_flights)
                    }
                );
            }

        }
    };

    handleRegister = (event) => {
        const uid = localStorage.getItem('user')
        const id = event.target.parentNode.id
        console.log(id)
        console.log(event.target)
        console.log(event.target.parentNode)
        const className = event.target.parentNode.className
        let content = event.target.parentNode.textContent
        content = content.slice(0, content.length - 8)
        const content_array = content.split('->')
        let array = []
        for (let c of content_array) {
            array.push(c.trim())
        }
        console.log(array)
        console.log(id);
        console.log(className)

        if(className === "transit card-body") {
            console.log(this.state.other_flights[parseInt(id)])
            const stop_array = this.state.other_flights[parseInt(id)]
            
            for (let stop of stop_array) {
              const index = stop_array.indexOf(stop)
              console.log(index)
              if(index < (stop_array.length - 1)) {
                  //let d = stop.Departure.ScheduledTimeLocal.DateTime;
                  //d = d.split('T')[0];
                  const flight_number = stop.MarketingCarrier.AirlineID + stop.MarketingCarrier.FlightNumber
                  const origin = array[index].split('(')[0].trim()
                  const destination = array[index + 1].split('(')[0].trim()
                  let airport_code = array[index + 1].split('(')[1]
                  airport_code = airport_code.split(')')[0]
                  const destination_country_code = this.state.look_up_code[airport_code]
                  //console.log(destination_country_code)
                  const destination_country_name = code_to_name[destination_country_code]['cdc_name']

                  let origin_airport_code = array[0].split('(')[1]
                  origin_airport_code = origin_airport_code.split(')')[0]
                  const origin_country_code = this.state.look_up_code[origin_airport_code]
                  //console.log(destination_country_code)
                  const origin_country_name = code_to_name[origin_country_code]['cdc_name']

                  let departure_time = stop.Departure.ScheduledTimeLocal.DateTime.split('T')
                  departure_time = departure_time.join(' ')

                  let arrival_time = stop.Arrival.ScheduledTimeLocal.DateTime.split('T')
                  arrival_time = arrival_time.join(' ')
                  console.log('origin ', origin)
                  console.log('destination ', destination)
                  console.log('flight number ', flight_number)
                  console.log('departure_time ', departure_time)
                  console.log('arrival time ', arrival_time)
                  
                  const node_ref = Firebase.database().ref(`flights/${flight_number}`).push()
                  node_ref.set({
                      passenger_id: uid,
                      flight_number: flight_number,
                      origin: origin,
                      destination: destination,
                      destination_country: destination_country_name,
                      origin_country: origin_country_name,
                      departure_time: departure_time,
                      arrival_time: arrival_time,
                      status: 'transit'
                  })
                  .then(() => {
                    console.log('new flight registration is logged');
                    //this.props.history.push('/home');
                    //this.setState({ show: true })
                    //this.setState({ message: "You have registered for " + flight_number + ' successfully!' })
                  })
                  .catch(error => {
                    console.log(error);
                    console.log('error when logging new flight registration')
                    this.setState({ error });
                  });
                  
                  // transit
              } else {
                  console.log('#@@@@@@@')
                  const flight_number = stop.MarketingCarrier.AirlineID + stop.MarketingCarrier.FlightNumber
                  const origin = array[index].split('(')[0].trim()
                  const destination = array[index + 1].split('(')[0].trim()

                  let airport_code = array[index + 1].split('(')[1]
                  airport_code = airport_code.split(')')[0]
                  const destination_country_code = this.state.look_up_code[airport_code]
                  //console.log(destination_country_code)
                  const destination_country_name = code_to_name[destination_country_code]['cdc_name']

                  let origin_airport_code = array[0].split('(')[1]
                  origin_airport_code = origin_airport_code.split(')')[0]
                  const origin_country_code = this.state.look_up_code[origin_airport_code]
                  //console.log(destination_country_code)
                  const origin_country_name = code_to_name[origin_country_code]['cdc_name']
                  console.log('%%%%%%%%%%')
                  console.log(origin_airport_code)
                  console.log(origin_country_name)

                  
                  let departure_time = stop.Departure.ScheduledTimeLocal.DateTime.split('T')
                  departure_time = departure_time.join(' ')

                  let arrival_time = stop.Arrival.ScheduledTimeLocal.DateTime.split('T')
                  arrival_time = arrival_time.join(' ')
                  console.log('origin ', origin)
                  console.log('destination ', destination)
                  console.log('flight number ', flight_number)
                  console.log('departure_time ', departure_time)
                  console.log('arrival time ', arrival_time)

                  const node_ref = Firebase.database().ref(`flights/${flight_number}`).push()
                  node_ref.set({
                      passenger_id: uid,
                      flight_number: flight_number,
                      origin: origin,
                      destination: destination,
                      destination_country: destination_country_name,
                      origin_country: origin_country_name,
                      departure_time: departure_time,
                      arrival_time: arrival_time,
                      status: 'other'
                  })
                  .then(() => {
                      console.log('new flight registration is logged');
                      this.setState({ message: "You have registered for the flight successfully!" }, () => {
                        this.setState({ show: true })
                      })
                      //this.props.history.push('/home');
                  })
                  .catch(error => {
                      console.log(error);
                      console.log('error when logging new flight registration')
                      this.setState({ error });
                  });
              }
              
            }
            
        } else {
            // direct flights
            console.log(id)
            console.log(this.state.direct_flights)
            const flight = this.state.direct_flights[parseInt(id)]
            console.log(this.state.direct_flights[parseInt(id)])
            const flight_number = flight.MarketingCarrier.AirlineID + flight.MarketingCarrier.FlightNumber
            const origin = array[0].split('(')[0].trim()
            const destination = array[1].split('(')[0].trim()

            let origin_airport_code = array[0].split('(')[1]
            origin_airport_code = origin_airport_code.split(')')[0]
            console.log('###########')
            console.log(this.state.look_up_code)
            console.log(origin_airport_code)
            console.log('###########')
            const origin_country_code = this.state.look_up_code[origin_airport_code]
            //console.log(destination_country_code)
            const origin_country_name = code_to_name[origin_country_code]['cdc_name']


            let airport_code = array[1].split('(')[1]
            airport_code = airport_code.split(')')[0]
            const destination_country_code = this.state.look_up_code[airport_code]
            //console.log(destination_country_code)
            const destination_country_name = code_to_name[destination_country_code]['cdc_name']

            
            let departure_time = flight.Departure.ScheduledTimeLocal.DateTime.split('T')
            departure_time = departure_time.join(' ')

            let arrival_time = flight.Arrival.ScheduledTimeLocal.DateTime.split('T')
            arrival_time = arrival_time.join(' ')
            console.log('origin ', origin)
            console.log('destination ', destination)
            console.log('flight number ', flight_number)
            console.log('departure_time ', departure_time)
            console.log('arrival time ', arrival_time)


            const node_ref = Firebase.database().ref(`flights/${flight_number}`).push()
            node_ref.set({
                passenger_id: uid,
                flight_number: flight_number,
                origin: origin,
                destination: destination,
                destination_country: destination_country_name,
                origin_country: origin_country_name,
                departure_time: departure_time,
                arrival_time: arrival_time,
                status: 'other'
            })
            .then(() => {
                console.log('new flight registration is logged');
                this.setState({ message: "You have registered for " + flight_number + ' successfully!'}, () => {
                  this.setState({ show: true })
                });
                //this.props.history.push('/home');
            })
            .catch(error => {
                console.log(error);
                console.log('error when logging new flight registration')
                this.setState({ error });
            });
        }
        /*
        let month = String((this.state.dod.getMonth() + 1));
        const pattern = /^[1-9]$/
        if(pattern.test(month)) {
            month = '0' + month
        }
        const date = this.state.dod.getFullYear() + '-' + month + '-' + this.state.dod.getDate();
        
        const node_ref = this.props.firebase.db.ref(`flights/${content}`).push()
        node_ref.set({
            passenger_id: uid,
            flight_content: content,
            date_of_departure: date
        })
        .then(() => {
          console.log('new flight registration is logged');
          //this.props.history.push('/home');
        })
        .catch(error => {
          console.log(error);
          console.log('error when logging new flight registration')
          this.setState({ error });
        });
        */
        

        
    }

    componentDidMount() {
        const currentUser = localStorage.getItem('user')
          if(!currentUser) {
              this.props.history.push('/')
        }
    }
      
    render() {

        const inputOriginProps = {
            placeholder: 'Enter Your Origin',
            value: this.state.origin,
            onChange: this.onOriginChange
        };

        const inputDestinationProps = {
            placeholder: 'Enter Your Destination',
            value: this.state.destination,
            onChange: this.onDestinationChange
        };
        return (
          <div>
              <Navbar />
              <div className="flightcontainer">
                  <Card>
                      <Card.Body id='card_body'>
                          <div>
                              <p>Origin</p>
                              <Autosuggest
                                suggestions={this.state.origin_suggestions}
                                onSuggestionsFetchRequested={this.onOriginSuggestionsFetchRequested}
                                onSuggestionsClearRequested={this.onOriginSuggestionsClearRequested}
                                getSuggestionValue={this.getOriginSuggestionValue}
                                renderSuggestion={this.renderOriginSuggestion}
                                inputProps={inputOriginProps}
                              />
                          </div>
                          <div>
                              <p>Destination</p>
                              <Autosuggest
                                suggestions={this.state.destination_suggestions}
                                onSuggestionsFetchRequested={this.onDestinationSuggestionsFetchRequested}
                                onSuggestionsClearRequested={this.onDestinationSuggestionsClearRequested}
                                getSuggestionValue={this.getDestinationSuggestionValue}
                                renderSuggestion={this.renderDestinationSuggestion}
                                inputProps={inputDestinationProps}
                              />
                          </div>
                          <div>
                              <p>Date of Depature</p>
                              <DatePicker
                              onChange={e => this.setState({ dod: e })}
                              value={this.state.dod}
                            />
                        </div>
                        <div className="card-btn">
                        <Button variant="warning" onClick={this.handleSearch}>Search</Button>
                        </div>
                    </Card.Body>
                  </Card>
                  <div>
                  <div className="card-text">
                      <h2>Direct Flights</h2>
                  </div>
                  {this.state.direct_flights.map((flight, index) => (
                      <Card className='flight' key={index}>
                          <Card.Body className='direct' id={index}>
                              {this.state.origin + ' -> ' + this.state.look_up[flight.Arrival.AirportCode] + ' (' + flight.Arrival.AirportCode + ')' + '  ' + flight.MarketingCarrier.AirlineID + flight.MarketingCarrier.FlightNumber}
      
                              <Button variant="warning" onClick={this.handleRegister} className="card-btn">Register</Button>
                              
                          </Card.Body>
                      </Card>
                  ))}
                </div>
                <div>
                  <div className="card-text">
                      <h2>Transit Flights</h2>
                  </div>
                  {this.state.other_flights.map((flight, index) => (
                      <Card className='flight' key={index}>
                          <Card.Body id={index} className='transit'>
                              {this.state.origin}
                              {flight.map(stop => 
                                  { return '  ' + stop.MarketingCarrier.AirlineID + stop.MarketingCarrier.FlightNumber + '  ' + stop.Departure.ScheduledTimeLocal.DateTime + '  ' + ' -> ' + this.state.look_up[stop.Arrival.AirportCode]  + ' (' + stop.Arrival.AirportCode + ')' + '  '}
                                  //{return this.state.look_up[stop.Depature.AirportCode]}
                              )}
                              <Button variant="warning" onClick={this.handleRegister} className="card-btn">Register</Button>
                          </Card.Body>
                      </Card>
                  ))}
                </div>
              </div>
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
          </div>
        );
    }

}

const FlightRegister = compose(
	withRouter,
	withFirebase,
)(FlightRegisterBase);

export default FlightRegister;
