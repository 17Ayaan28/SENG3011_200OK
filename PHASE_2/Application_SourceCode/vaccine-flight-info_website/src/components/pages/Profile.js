import {Link} from "react-router-dom";
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Navbar from '../Navbar'
import './vaccine_history.css'
import './Profile.css'

function Profile() {
	return (
        <>
        <Navbar />
		<br></br>
		<br></br>
        <div class="container">
            <div class="row">
                <div className="col margin-90">
                    <img src='/images/avatar.jpg' className="profile-avatar"></img>
                    <div className="profile-info">
                        <div className="profile-text">
                            <div className="profile-name">Full Name</div>
                            <div className="profile-identity">xyz@gmail.com</div>
                            <div className="profile-follower">Passport: E1234567</div>
                        </div>
                    </div> 
                </div>
            </div>
        </div>
        </>
	);
}

export default Profile;