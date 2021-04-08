import React, { useState, forwardRef } from 'react'
import '../../App.css'
import DatePicker from 'react-datepicker';
import './AirportStaffFlight.css'
import FlightCards from '../FlightCards'
import Navbar from '../Navbar'
import "react-datepicker/dist/react-datepicker.css";

export default function AirportStaffFlight() {
    const [startDate, setStartDate] = useState(new Date());
    const ExampleCustomInput = forwardRef(
        ({ value, onClick }, ref) => (
          <button className="example-custom-input" onClick={onClick} ref={ref}>
            {value}
          </button>
        ),
    );
    return (
    <>
        <Navbar />
        <br />
        <h1 className="flightdetails">Scheduled Flights</h1>
        <br />
        <h1 className="datepicker">
        <DatePicker className="datepicker"
            selected={startDate}
            onChange={date => setStartDate(date)}
            customInput={<ExampleCustomInput />}
        />
        </h1>
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
