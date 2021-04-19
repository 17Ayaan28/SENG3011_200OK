import React, {useState, useEffect} from 'react'
import { Link , useHistory } from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
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
                            <Link to='/fp' className="nav-links-mobile" onClick={handleLogout}>
                               Log out
                            </Link>                                
                        </li>
                    </ul>
                    {currentUser && currentUser.email}
                    <Button variant="primary" type="submit"><Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>Profile</Link></Button>
                    {currentUser && <Button onClick={handleLogout} buttonStyle ='btn--outline'>LOG OUT</Button>}
                </div>
            </nav>
            </>
    );
}

export default Navbar;
