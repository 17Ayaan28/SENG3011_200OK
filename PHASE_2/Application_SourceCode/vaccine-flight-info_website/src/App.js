import React from 'react'
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import home from './home';
import Login from './Login';
import Register from './Register';
import vaccine_history from './components/pages/vaccine_history';
import AirportStaffFlight from './components/pages/AirportStaffFlight';
import AirportStaffPassengerDetails from './components/pages/AirportStaffPassengerDetails';
import Vaccine from './Vaccine_by_location'
import TravelInfo from './TravelInfo'
import FlightRegister from './components/pages/FlightRegister'
import NewsOutbreaks from './components/pages/NewsOutbreaks'
import Maps from './components/pages/Maps'
import Profile from './components/pages/Profile'
import { AuthProvider } from "./contexts/AuthContext"


function App() {

  return (
    <AuthProvider>  
        <Router>
        {/* <Home /> */}
          <Switch> 
            <Route path='/profile' component={Profile}/>

            <Route path='/fp' component={Home} /> 

            <Route path='/fp' component={Home} /> 
            <Route path='/login'  component={Login} />
            <Route path='/register'  component={Register} />
            
            <Route path='/' exact component={home} />
            <Route path='/home' exact component={home} />
            <Route path='/vaccine' exact component={Vaccine} />
            <Route path='/flights' component={FlightRegister} />
            <Route path='/maps' component={Maps} />
            <Route path='/travelInfo' component={TravelInfo} />
            <Route path='/vaccination-history' component={vaccine_history} />
            <Route path='/airport-staff-flight-details' component={AirportStaffFlight} />
            <Route path='/mu7366passenger-details' component={AirportStaffPassengerDetails} />
            <Route path='/uganda-news' component={NewsOutbreaks} />
          </Switch>
        </Router>
    </AuthProvider>
  );
}

export default App;
