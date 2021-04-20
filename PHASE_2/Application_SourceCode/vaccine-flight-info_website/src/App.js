import React from 'react'
import './App.css';
import Navbar from './components/Navbar';
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
import FlightRegister from './components/pages/FlightRegister'
import NewsOutbreaks from './components/pages/NewsOutbreaks'
import Maps from './components/pages/Maps'
import Skyscanner from './skyscanner';
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
            <Route path='/' exact component={LandingPage} />
            <Route path='/home' exact component={Home} />
            <Route path='/vaccine' exact component={Vaccine} />
            <Route path='/flights' component={FlightRegister} />
            <Route path='/maps' component={Maps} />
            <Route path='/travelInfo?country=:country' component={TravelInfo} />
            <Route path='/vaccination-history' component={Vaccine_history} />
            <Route path='/airport-staff-flight-details' component={AirportStaffFlight} />
            <Route path='/mu7366passenger-details' component={AirportStaffPassengerDetails} />
            <Route path='/uganda-news' component={NewsOutbreaks} />
            <Route path='/skyscanner' component={Skyscanner} />
          </Switch>
        </Router>
      </>
  );
}

export default withAuthentication(App);
