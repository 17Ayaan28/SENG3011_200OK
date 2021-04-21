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
                <div class="col-8">
                    <h2>Vaccine History</h2>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>Vaccine Name</th>
                            <th>Proof Document</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>1</td>
                            <td>Dukoral</td>
                            <td><a href="https://i.pinimg.com/originals/83/f1/67/83f167f885204677b2a61dc8ece029bd.jpg">Medical Certificate</a></td>
                            </tr>
                            <tr>
                            <td>2</td>
                            <td>Dukoral</td>
                            <td><a href="https://i.pinimg.com/originals/83/f1/67/83f167f885204677b2a61dc8ece029bd.jpg">Medical Certificate</a></td>
                            </tr>
                            <tr>
                            <td>3</td>
                            <td>Dukoral</td>
                            <td><a href="https://i.pinimg.com/originals/83/f1/67/83f167f885204677b2a61dc8ece029bd.jpg">Medical Certificate</a></td>
                            </tr>
                            <tr>
                            <td>4</td>
                            <td>Avaxim</td>
                            <td><a href="https://i.pinimg.com/originals/83/f1/67/83f167f885204677b2a61dc8ece029bd.jpg">Medical Certificate</a></td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button variant="primary" type="submit">Upload New Record</Button>

                </div>
            </div>
        </div>
        </>
	);
}

export default Profile;