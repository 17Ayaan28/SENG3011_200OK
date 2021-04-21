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
            console.log('##############')
            console.log(snapshot.val())
            //let flight = {}
            //flight['flight_number']
            //this.setState({ flights: snapshot.val() })
            
            snapshot.forEach((userSnapshot) => {
                console.log(userSnapshot.key)
                //let f = userSnapshot.val()
                //let date = f.departure_time
                //date = date.split(' ')[0]
                //if(search_date === date) {
                //    console.log('hihi')
                //    flights.push(f);
                //    this.setState({ flights: flights })
                //}
                //console.log('first')'
                /*
                userSnapshot.forEach((passenger) => {
                    const id = passenger.key;
                    const data = passenger.val();
                    //console.log('second')
                    //console.log('search date ', search_date)
                    //console.log('flight date ', data.departure)
                    let date = data.departure_time
                    date = date.split(' ')[0]
                    if(search_date === date) {
                        console.log('hihi')
                        flights.push(data);
                        this.setState({ flights: flights })
                    }
                })
                */
            });
		})
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
                            keys.push(passenger.key)
                            /*
                            const data = passenger.val();
                            //console.log('second')
                            //console.log('search date ', search_date)
                            //console.log('flight date ', data.departure)
                            let date = data.departure_time
                            date = date.split(' ')[0]
                            if(search_date === date) {
                                console.log('hihi')
                                flights.push(data);
                                console.log(flights)
                            }
                            */
                        })
                        //console.log(keys)
                        const record = userSnapshot.val()[keys[0]]
                        console.log(record)
                    });
                })
                this.setState({ flights: flights })
            })
        }
    }

    handleFlightDetails = (e) => {
        //console.log(e.target.innerText)
        const id = e.target.parentNode.id
        const flight = this.state.flights[id]
        console.log(flight)

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
            <>
                <Navbar />
                <h1 className="flightdetails">Scheduled Flights</h1>
                <h3>Select Date</h3>
                <DatePicker
                    onChange={this.handleDateChange}
                    value={this.state.search_date}
                />
                {this.state.flights.map((flight, index) => (
                    <Card className='flight' onDoubleClick={this.handleFlightDetails}>
                        <Card.Body id={index}>
                            <h4>{flight.flight_number}</h4>
                            <div>{flight.origin + ' -> ' + flight.destination}</div>
                            <div>{'Departure Date & Time (local): ' + flight.departure_time}</div>
                            <div>{'Arrival Date & Time (local): ' + flight.arrival_time}</div>
                        </Card.Body>
                     </Card>
                ))}
            </>
        );
    }

}

function getCurrentDate(separator='') {

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}


const AirportStaffFlight = compose(
	withRouter,
	withFirebase,
)(AirportStaffFlightBase);

export default AirportStaffFlight