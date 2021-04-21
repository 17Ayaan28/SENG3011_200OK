import React from 'react'
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import LandingPage from './home';
import LogInPage from './login';
import RegisterPage from './register';
import Vaccine_history from './components/pages/vaccine_history';
import AirportStaffFlight from './components/pages/AirportStaffFlight';
import AirportStaffPassengerDetails from './components/pages/AirportStaffPassengerDetails';
import Vaccine from './Vaccine_by_location'
import TravelInfo from './TravelInfo'
import NewsOutbreaks from './components/pages/NewsOutbreaks'
import Maps from './components/pages/Maps'
import Profile from './components/pages/Profile'
import Skyscanner from './skyscanner'
import Base64 from './base64CallBack'
import Restriction from './restriction'
import FlightRegister from './components/pages/FlightRegister'

import { withAuthentication } from './components/Session';



function App() {
  return (
      <>
        <Router>
        <Route path='/'/>
        {/* <Home /> */}
          <Switch> 
            
            <Route path='/login'  component={LogInPage} />
            <Route path='/register'  component={RegisterPage} />

            <Route path='/home' exact component={Home} />
            <Route path='/vaccine' exact component={Vaccine} />
            
            <Route path='/maps' component={Maps} />

            <Route path='/travelInfo/:country' component={TravelInfo} />
            <Route path='/vaccination-history' component={Vaccine_history} />
            <Route path='/airport-staff-flight-details' component={AirportStaffFlight} />
            <Route path='/flight-details/:flight_number' component={AirportStaffPassengerDetails} />
            {/*<Route path='/flights' component={FlightRegister} />
            <Route path='/skyscanner' component={Skyscanner} />*/}
            <Route path='/flights' component={FlightRegister} />
            <Route path='/convert' component={Base64} />
            <Route path='/news/:country' component={NewsOutbreaks} />
            <Route path='/profile' component={Profile} />
            <Route path='/restriction/:country' component={Restriction} />
            <Route path='/' exact component={LandingPage} />
            <Route path='/fp' component={Home} /> 
          </Switch>
        </Router>
      </>
  );
}

export default withAuthentication(App);
