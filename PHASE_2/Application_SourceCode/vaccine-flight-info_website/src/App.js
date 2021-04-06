import React from 'react'
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Flights from './components/pages/Flights';

function App() {
  return (
      <>
        <Router>
          <Navbar />
        {/* <Home /> */}
          <Switch>  
            <Route path='/' exact component={Home} />
            <Route path='/flights' component={Flights} />
          </Switch>
        </Router>
      </>
  );
}

export default App;
