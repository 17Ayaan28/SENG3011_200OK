import './App.css';
import Navbar from './components/Navbar';
import './Page1.css';
import './Page2.css';
import './home.css';
import './register.css';
import './login.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import home from "./home";
import register from "./register";
import login from "./login";

function App() {
  return (
      <>
      <Router>
        
        <Switch>  
          <Route path="/home" component={home} />
          <Route path="/search" component={Page1} />
          <Route path="/Page2" component={Page2} />
          <Route path="/Page3" component={Page3} />
          <Route path="/register" component={register} />
          <Route path="/login" component={login} />
        </Switch>
        </Router>
      </>
  );
}

export default App;
