import React from 'react'
import '../../App.css'
import './AirportStaffFlight.css'
import FlightCards from '../FlightCards'

export default function AirportStaffFlight() {

    return (
    <>
        <br />
        <h1 className="flightdetails">Scheduled Flights</h1>
        <br />
        <h1 className="currentDate">{getCurrentDate("-")}</h1>
        <FlightCards />
    </>
    );

}

function getCurrentDate(separator='') {

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}
