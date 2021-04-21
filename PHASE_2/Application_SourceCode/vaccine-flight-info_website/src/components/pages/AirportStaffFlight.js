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
                console.log('first')
                userSnapshot.forEach((passenger) => {
                    const id = passenger.key;
                    const data = passenger.val();
                    console.log('second')
                    console.log(data.date_of_departure)
                    if(search_date === data.date_of_departure) {
                        console.log('hihi')
                        flights.push(data);
                        this.setState({ flights: flights })
                    }
                })
			});
		})
    }

    handleDateChange = (new_date) => {
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
                    userSnapshot.forEach((passenger) => {
                        const id = passenger.key;
                        const data = passenger.val();
                        //console.log('second')
                        console.log('search date ', search_date)
                        console.log('flight date ', data.date_of_departure)
                        if(search_date === data.date_of_departure) {
                            console.log('hihi')
                            flights.push(data);
                            this.setState({ flights: flights })
                        }
                    })
                });
            })
        })
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
                    {this.state.flights.map(flight => (
                        <Card className="staff-card">
                            <Card.Body>
                                {flight.flight_content}
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
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