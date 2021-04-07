import React from 'react'
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Flights from './components/pages/Flights';
import AirportStaffFlight from './components/pages/AirportStaffFlight';
import AirportStaffPassengerDetails from './components/pages/AirportStaffPassengerDetails';
function App() {
  return (
      <>
        <Router>
          <Navbar />
        {/* <Home /> */}
          <Switch>  
            <Route path='/' exact component={Home} />
            <Route path='/flights' component={Flights} />
            <Route path='/airport-staff-flight-details' component={AirportStaffFlight} />
            <Route path='/mu7366passenger-details' component={AirportStaffPassengerDetails} />
          </Switch>
        </Router>
      </>
  );
}

export default App;
