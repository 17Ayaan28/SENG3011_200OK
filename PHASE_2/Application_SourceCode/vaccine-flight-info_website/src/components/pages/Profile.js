import {Link} from "react-router-dom";
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Navbar from '../Navbar'
import './vaccine_history.css'
import './Profile.css'
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Card } from 'react-bootstrap';
import Firebase from '../Firebase/firebase'

class ProfileBase extends React.Component {

    constructor(props) {
        super(props);
      
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            info: '',
        }
    };

    componentDidMount() {
        //console.log(this.props)
        const currentUser = localStorage.getItem('user')
        if(!currentUser) {
            this.props.history.push('/')
        }
        const user_ref = Firebase.database().ref(`users/${currentUser}`)
        user_ref.on('value', (snapshot) => {
            //console.log(snapshot.val())
            const userData = snapshot.val()
            if(userData.role === 'user') {
                const e = document.getElementById('user');
                e.style.display = 'block'
            } else {
                const e = document.getElementById('staff')
                e.style.display = 'block'
            }
            this.setState({ role: userData.role })
            this.setState({ first_name: userData.first_name })
            this.setState({ last_name: userData.last_name })
            this.setState({ email: userData.email })
            this.setState({ info: userData.credential })
        })
    }
    

    render() {
	return (
        <>
        <Navbar />
		<br></br>
		<br></br>
        <div className="container">
            <div className="row">
                <div className="col margin-90">
                        <img src='/images/avatar.jpg' className="profile-avatar"></img>
                        <div className="profile-info">
                            <div className="profile-text">
                                <div className="profile-name">{this.state.first_name + ', ' + this.state.last_name}</div>
                                <div className="profile-identity">Email: {this.state.email}</div>
                                <div className="profile-follower" id='user'>Passport: {this.state.info}</div>
                                <div className="profile-follower" id='staff'>Employee ID: {this.state.info}</div>
                            </div>
                        </div> 
                </div>
            </div>
        </div>
        </>
	);
    }
}

const Profile = compose(
	withRouter,
	withFirebase,
)(ProfileBase);

export default Profile;