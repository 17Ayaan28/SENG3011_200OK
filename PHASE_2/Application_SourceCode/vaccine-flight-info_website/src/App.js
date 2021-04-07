import './App.css';
import Navbar from './components/Navbar';
import './Page1.css';
import './Page2.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";

function App() {
  return (
      <>
      <Router>
        <Navbar />
        <Switch>  
          <Route path="/" exact />
          <Route path="/search" component={Page1} />
          <Route path="/Page2" component={Page2} />
          <Route path="/Page3" component={Page3} />
        </Switch>
        </Router>
      </>
  );
}

export default App;
