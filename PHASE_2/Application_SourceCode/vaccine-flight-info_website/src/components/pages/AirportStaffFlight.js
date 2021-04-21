import React, { useState }from 'react'
import '../../App.css'
import DatePicker from 'react-date-picker';
import './AirportStaffFlight.css'
import FlightCards from '../FlightCards'
import Navbar from '../Navbar'
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Card } from 'react-bootstrap';

class AirportStaffFlightBase extends React.Component {
    
    constructor(props) {
        super(props);
      
        this.state = {
            search_date: new Date(),
            flights: []
        }
    };

    componentDidMount() {
        const flights = []
		const uid = this.props.firebase.auth.currentUser.uid

        let search_date = this.state.search_date;
        let month = String((search_date.getMonth() + 1));
        
        const pattern = /^[1-9]$/
        if(pattern.test(month)) {
            month = '0' + month
        }
        search_date = search_date.getFullYear() + '-' + month + '-' + search_date.getDate();
        console.log(search_date)
        const flights_ref = this.props.firebase.db.ref(`flights`);
		flights_ref.on('value', (snapshot) => {
            snapshot.forEach((userSnapshot) => {
                //console.log('first')
                console.log(userSnapshot.key)
                let keys = []
                userSnapshot.forEach((passenger) => {
                    //const id = passenger.key;
                    
                    const data = passenger.val();
                    //console.log('second')
                    console.log('search date ', search_date)
                    console.log('flight date ', data.departure_time)
                    let date = data.departure_time
                    date = date.split(' ')[0]
                    if(search_date === date) {
                        keys.push(passenger.key)
                        //console.log('hihi')
                        //flights.push(data);
                        //console.log(flights)
                    }
                    
                })
                //console.log(keys)
                if(keys.length > 0) {
                    const record = userSnapshot.val()[keys[0]]
                    console.log(record)
                    flights.push(record)
                }
            });
        })
        console.log(flights)
        this.setState({ flights: flights })
    }

    handleDateChange = (new_date) => {
        if(new_date !== null) {
            this.setState({ search_date: new_date }, () => {
                const flights = []
                const uid = this.props.firebase.auth.currentUser.uid

                let search_date = this.state.search_date;
                let month = String((search_date.getMonth() + 1));
                
                const pattern = /^[1-9]$/
                if(pattern.test(month)) {
                    month = '0' + month
                }
                search_date = search_date.getFullYear() + '-' + month + '-' + search_date.getDate();
                const flights_ref = this.props.firebase.db.ref(`flights`);
                flights_ref.on('value', (snapshot) => {
                    snapshot.forEach((userSnapshot) => {
                        //console.log('first')
                        console.log(userSnapshot.key)
                        let keys = []
                        userSnapshot.forEach((passenger) => {
                            //const id = passenger.key;
                            
                            const data = passenger.val();
                            //console.log('second')
                            console.log('search date ', search_date)
                            console.log('flight date ', data.departure_time)
                            let date = data.departure_time
                            date = date.split(' ')[0]
                            if(search_date === date) {
                                keys.push(passenger.key)
                                //console.log('hihi')
                                //flights.push(data);
                                //console.log(flights)
                            }
                            
                        })
                        //console.log(keys)
                        if(keys.length > 0) {
                            const record = userSnapshot.val()[keys[0]]
                            console.log(record)
                            flights.push(record)
                        }
                    });
                })
                console.log(flights)
                this.setState({ flights: flights })
            })
        }
    }

    handleFlightDetails = (e) => {
        //console.log(e.target.innerText)
        console.log(e.target)
        const id = e.target.parentNode.id
        const flight = this.state.flights[id]
        console.log('$$$$$$$$$$$$')
        console.log(flight)
        console.log('$$$$$$$$$$$$')

        //const a1 = flight.origin.replace(' ', '-')
        //const a2 = flight.destination.replace(' ', '-')
        //const params = 'flight_number=' + flight.flight_number 
        //+ '&arrival=' + flight.arrival_time
        //+ '&depature=' + flight.departure_time + '&origin=' + flight.origin_country + '&origin_airport=' + a1
        //+ '&destination=' + flight.destination_country + '&destination_airport=' + a2 
        this.props.history.push({
            pathname: '/flight-details/' + flight.flight_number
        });
        console.log()
    }

    render() { 
        return (
            <div>
                <Navbar />
                <div className="staff-container">
                    <h1 className="flightdetails">Scheduled Flights</h1>
                    <div className="staff-search">
                    <h4>Select Date</h4>
                    <DatePicker
                        onChange={this.handleDateChange}
                        value={this.state.search_date}
                    />
                </div>
                {this.state.flights.map((flight, index) => (
                    <Card className='flight staff-card'>

                        <Card.Body id={index}>
                            <h4 onDoubleClick={this.handleFlightDetails}>{flight.flight_number}</h4>
                            <div onDoubleClick={this.handleFlightDetails}>{flight.origin + ' -> ' + flight.destination}</div>
                            <div onDoubleClick={this.handleFlightDetails}>{'Departure Date & Time (local): ' + flight.departure_time}</div>
                            <div onDoubleClick={this.handleFlightDetails}>{'Arrival Date & Time (local): ' + flight.arrival_time}</div>
                        </Card.Body>
                     </Card>
                ))}
                </div>
            </div>
        );
    }

}

const AirportStaffFlight = compose(
	withRouter,
	withFirebase,
)(AirportStaffFlightBase);

export default AirportStaffFlight