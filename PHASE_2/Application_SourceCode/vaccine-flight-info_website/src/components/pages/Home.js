import React, { Component } from 'react'
import '../../App.js'
import VidSlide from '../VidSlide'
import Cards from '../Cards'
import Navbar from '../Navbar';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import Firebase from '../Firebase/firebase';

class HomeBase extends Component {

    constructor(props) {
		super(props);
        this.state = {
            navbar: <></>
        }
	}

    componentDidMount() {
        //console.log(this.props.firebase.auth.currentUser)
        //const firebase = new Firebase()
        //const db = firebase.database()
        //console.log(db)
        if(this.props.firebase.auth.currentUser === null) {
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

const Home = compose(
	withRouter,
	withFirebase,
)(HomeBase);

export default Home;
