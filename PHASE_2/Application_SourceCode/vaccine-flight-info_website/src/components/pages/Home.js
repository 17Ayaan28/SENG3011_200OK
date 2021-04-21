import React, { Component } from 'react'
import '../../App.js'
import VidSlide from '../VidSlide'
import Cards from '../Cards'
import Navbar from '../Navbar';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
//import Firebase from '../Firebase/firebase';
//import { useSelector } from 'react-redux'
import { connect } from 'react-redux';
import Firebase from '../Firebase/firebase'

class HomeBase extends Component {

    constructor(props) {
		super(props);
        this.state = {
            navbar: <></>,
            a: Firebase.auth,
            firebase: undefined
        }
	}

    componentDidMount() {
        //console.log(this.props.firebase.auth.currentUser)
        //const firebase = new Firebase()
        //const db = firebase.database()
        //console.log(db)
        console.log('HELLO')
        //console.log(Firebase)
        //console.log(Firebase.database())
        console.log(this.state.a.currentUser)
        console.log(Firebase.auth.currentUser)
        const currentUser = localStorage.getItem('user')
        if(!currentUser) {
            //this.setState({ firebase: new FirebaseBase() })
            //console.log(Firebase.auth)
            //const ref = Firebase.database().ref('users')
            //ref.on('value', (snapshot) => {
            //    console.log(snapshot.val())
            //})
            /*
            Firebase.doSignOut()
            .then(() => {
                console.log('logged out!');
                this.props.history.push('/');
            })
            .catch(error => {
                console.log('fking error when logging out');
                console.log(error);
                this.setState({ error });
            });
            */
            this.props.history.push('/')
        } else {
            this.setState({ navbar: <Navbar /> })
        }
    }

    render() {
        return(
            <div>
                {this.state.navbar}
                <VidSlide />
                {/* <Cards /> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { fire: state.firebase}
}

const Home = compose(
	withRouter,
	withFirebase,
)(HomeBase);


export default connect(mapStateToProps)(Home);
