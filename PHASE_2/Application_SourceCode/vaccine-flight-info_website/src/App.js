import React from 'react'
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import home from './home';
import login from './login';
import register from './register';
import vaccine_history from './components/pages/vaccine_history';
import AirportStaffFlight from './components/pages/AirportStaffFlight';
import AirportStaffPassengerDetails from './components/pages/AirportStaffPassengerDetails';
import Vaccine from './Vaccine_by_location'
import TravelInfo from './TravelInfo'
import FlightRegister from './components/pages/FlightRegister'
import NewsOutbreaks from './components/pages/NewsOutbreaks'
import Maps from './components/pages/Maps'
import Profile from './components/pages/Profile'
import skyscanner from './skyscanner'
import Base64 from './base64CallBack'


function App() {
  return (
      <>
        <Router>
        <Route path='/'/>
        {/* <Home /> */}
          <Switch> 
            
            <Route path='/login'  component={login} />
            <Route path='/register'  component={register} />
            <Route path='/home' exact component={Home} />
            <Route path='/vaccine' exact component={Vaccine} />
            <Route path='/flights' component={FlightRegister} />
            <Route path='/maps' component={Maps} />
            <Route path='/travelInfo/:country' component={TravelInfo} />
            <Route path='/vaccination-history' component={vaccine_history} />
            <Route path='/airport-staff-flight-details' component={AirportStaffFlight} />
            <Route path='/mu7366passenger-details' component={AirportStaffPassengerDetails} />
            <Route path='/skyscanner' component={skyscanner} />
            <Route path='/convert' component={Base64} />
            <Route path='/news/:country' component={NewsOutbreaks} />
            <Route path='/profile' component={Profile} />
            <Route path='/' exact component={home} />
            <Route path='/fp' component={home} /> 
    
          </Switch>
        </Router>
      </>
  );
}

export default App;
