import React, {useState, useEffect, Component} from 'react'
import { Link } from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css';
//import LogOutButton from './LogOutButton';
import { withRouter } from 'react-router-dom';
import { withFirebase } from './Firebase';
import { compose } from 'recompose';
import Firebase from './Firebase/firebase'
//import { AuthUserContext } from '../Session';

class NavbarBase extends Component {
    constructor(props) {
		super(props);
        
        this.state = {
            click: false,
            button: true
        }
	}

    handleClick = () => {
        this.setState({ click: !this.state.click });
    }

    closeMobileMenu = () => {
        this.setState({ click: false });
    }

    showButton = () => {
        if (window.innerWidth <= 960) {
            this.setState({ button: false });
        } else {
            this.setState({ button: true });
        }
    }

    handleLogOut = () => {
        this.setState({ click: false });
        if(localStorage.getItem('user')) {
            this.props.firebase.doSignOut()
            .then(() => {
                console.log('logged out!');
                this.props.history.push('/');
            })
            .catch(error => {
                console.log('fking error when logging out');
                console.log(error);
                this.setState({ error });
            });
        } else {
            Firebase.database().doSignOut()
            .then(() => {
                console.log('logged out!');
                this.props.history.push('/');
            })
            .catch(error => {
                console.log('fking error when logging out');
                console.log(error);
                this.setState({ error });
            });
        }
        localStorage.removeItem('user')
    }

    handleProfile = () => {
        console.log("hi")
        window.location.href="/profile"
    }

    componentDidMount() {
        const currentUser = localStorage.getItem('user')
        if(!currentUser) {
            this.props.history.push('/')
        }
        if(!localStorage.getItem('role')) {
            const user_role_ref = Firebase.database().ref(`users/${currentUser}/role`);
            let role;
            user_role_ref.on('value', (snapshot) => {
                role = snapshot.val();
                localStorage.setItem('role', role)
                if(role === "USER") {
                    const e = document.getElementById('staff_visible_only')
                    if(e) {
                        e.style.display = 'none'
                    }
                    const user_components = document.getElementsByClassName('user_visible_only')
                    for (let c of user_components) {
                        c.style.display = 'inline';
                    }
                } else {
                    const e = document.getElementById('staff_visible_only');
                    if(e) {
                        e.style.display = 'inline';
                    }
                    const user_components = document.getElementsByClassName('user_visible_only');
                    for (let c of user_components) {
                        c.style.display = 'none';
                    }
                }
            });
        } else {
            const role = localStorage.getItem('role')
            if(role === "USER") {
                const e = document.getElementById('staff_visible_only');
                if(e) {
                    e.style.display = 'none'
                }
                const user_components = document.getElementsByClassName('user_visible_only')
                for (let c of user_components) {
                    c.style.display = 'inline';
                }
            } else {
                const e = document.getElementById('staff_visible_only')
                if(e) {
                    e.style.display = 'inline';
                }
                const user_components = document.getElementsByClassName('user_visible_only');
                for (let c of user_components) {
                    c.style.display = 'none';
                }
            }
        }
        //if(!localStorage.getItem('user')) 
        
            //console.log(this.props.firebase.auth.currentUser.uid);
            /*
            const uid = localStorage.getItem('user')
            console.log(Firebase)
            const user_role_ref = Firebase.database().ref(`users/${uid}/role`);
            let role;
            user_role_ref.on('value', (snapshot) => {
                role = snapshot.val();
                if(role === "USER") {
                    document.getElementById('staff_visible_only').style.display = 'none'
                    const user_components = document.getElementsByClassName('user_visible_only')
                    for (let c of user_components) {
                        c.style.display = 'inline';
                    }
                } else {
                    document.getElementById('staff_visible_only').style.display = 'inline';
                    const user_components = document.getElementsByClassName('user_visible_only');
                    for (let c of user_components) {
                        c.style.display = 'none';
                    }
                }
            });
            */
        //const role = localStorage.getItem('role')

        window.addEventListener('resize', this.showButton);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.showButton);
    }

    render() {
        return (
            <>
            <nav className='navbar'>
                <div className="navbar-container">
                    <Link to="/home" className='navbar-logo' onClick={this.closeMobileMenu}>
                        DESTINATED   
                        <i className="fab fa-avianex"></i>
                    </Link>
                    <div className="menu-icon" onClick={this.handleClick}>
                        <i className={this.state.click ? 'fas fa-times' : 'fas fa-bars'}></i>
                    </div>
                    <ul className={this.state.click ? 'nav-menu active' : 'nav-menu'}>
                        
                        <li className="nav-item n" className="user_visible_only">
                            <Link to='/vaccine' className="nav-links" onClick={this.closeMobileMenu}>
                               Vaccines
                            </Link>
                        </li>
                        <li className="nav-item n" className="user_visible_only">
                            <Link to='/vaccination-history' className="nav-links" onClick={this.closeMobileMenu}>
                               Vaccination History
                            </Link>
                        </li>
                        <li className="nav-item n" className="user_visible_only">
                            <Link to='/flights' className="nav-links" onClick={this.closeMobileMenu}>
                               Register Flights
                            </Link>
                        </li>
                        <li className="nav-item n" id='staff_visible_only'>
                            <Link to='/airport-staff-flight-details' className="nav-links" onClick={this.closeMobileMenu}>
                               Flight Details
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/profile' className="nav-links-mobile" onClick={this.handleProfile}>
                               Profile
                            </Link>                                
                        </li>
                        <li className="nav-item">
                            <Link to='/' className="nav-links-mobile" onClick={this.handleLogOut}>
                               Log out
                            </Link>                                
                        </li>
                    </ul>
                    {this.state.button && <Button variant="primary" buttonStyle='btn--outline' type="submit" onClick={this.handleProfile}>Profile</Button>}
                    {this.state.button && <Button buttonStyle='btn--outline' onClick={this.handleLogOut}>LOG OUT</Button>}
                </div>
            </nav>
            </>
        );
    }
}
/*
function Navbar(props) {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click); 
    const closeMobileMenu = () => setClick(false); 

    const { logout, currentUser } = useAuth()
    const [error, setError] = useState('')
    const history = useHistory()

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
      }, []);

    window.addEventListener('resize', showButton);

    async function handleLogout() {
        setError(' ')
        try {
            await logout()
            alert("Successfuly logged out")
            history.push('/home')
        } catch {
            setError("Failed to log out")
        }
    }
    
    return (
            <>
            <nav className='navbar'>
                <div className="navbar-container">
                    <Link to="/home" className='navbar-logo' onClick={closeMobileMenu}>
                        DESTINATED   
                        <i className="fab fa-avianex"></i>
                    </Link>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'}></i>
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        
                        <li className="nav-item">
                            <Link to='/vaccine' className="nav-links" onClick={closeMobileMenu}>
                               Vaccines
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/vaccination-history' className="nav-links" onClick={closeMobileMenu}>
                               Vaccination History
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/flights' className="nav-links" onClick={closeMobileMenu}>
                               Register Flights
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/airport-staff-flight-details' className="nav-links" onClick={closeMobileMenu}>
                               Flight Details(Admin)
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/fp' className="nav-links-mobile" onClick={closeMobileMenu}>
                            </Link>                                
                        </li>
                    </ul>
                    <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}><Button variant="primary">Profile</Button></Link>
                    {button && <Button buttonStyle='btn--outline'>LOG OUT</Button>}
                </div>
            </nav>
            </>
    );
}

//class Log
*/
const Navbar = compose(
	withRouter,
	withFirebase,
)(NavbarBase);


export default Navbar;
