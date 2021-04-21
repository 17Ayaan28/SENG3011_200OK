import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Navbar from '../Navbar'
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { Card } from 'react-bootstrap';
import Axios from 'axios';
import './AirportStaffPassengerDetails.css'

function unique (arr) {
  return Array.from(new Set(arr))
}

class FlightDetailsBase extends React.Component {

    constructor(props) {
        super(props);
      
        this.state = {
            flights: [],
            passengers: [],
            historys: [],
            show: false,
            flight_number: '',
            vaccines: ''
        }
    };

    componentDidMount() {
        const flight_number = this.props.match.params.flight_number
        this.setState({ flight_number: flight_number })
        const uid = this.props.firebase.auth.currentUser.uid 
        console.log('~~~~~~~~~~~~~~~~~~')
        console.log(flight_number)
        console.log('~~~~~~~~~~~~~~~~~~')
        const flight_ref = this.props.firebase.db.ref(`flights/${flight_number}`);
        let fs = []
        let ps = []
        let hs = []
        let id;
        flight_ref.on('value', (snapshot) => {
            //const id = snapshot.key
            snapshot.forEach((userSnapshot) => {

                // userData: fligt data {arrival_time, departure_time, flight_number, passenger_id}
                const userData = userSnapshot.val();
                console.log('*************')
                console.log('Passenger id: ', userData.passenger_id)
                //console.log('*************')
                id = userData.passenger_id
                
                fs.push(userData)

                // Get user info
                let user;
                const user_ref = this.props.firebase.db.ref(`users/${id}`)
                user_ref.on('value', (snapshot) => {
                    //console.log(snapshot.val())
                    user = snapshot.val()['first_name'] + ', ' + snapshot.val()['last_name']
                    console.log('Passenger name: ', user)
                    ps.push(user)
                    this.setState({ passengers: ps })
                })
                
                let history = []
                // Get history
                const history_ref = this.props.firebase.db.ref(`v1/${id}`);
                history_ref.on('value', (snapshot) => {
                    snapshot.forEach((userSnapshot) => {
                        //console.log('%%%%%%%%%%%%%%%%%%')
                        const id = userSnapshot.key;
                        const userData = userSnapshot.val();
                        history.push(userData.disease);
                        //console.log(userData)
                        //console.log('%%%%%%%%%%%%%%%%%%')
                    });
                    const history_text = history.join(', ')
                    console.log('Passenger vaccine history: ', history_text)
                    hs.push(history_text)
                    this.setState({ historys: hs })
                })

                console.log('@@@@@@@@@@@@@')
                //console.log(hs)
                //this.setState({ historys: hs })
            });
            this.setState({ flights: fs })
        })
        //console.log('ppppppppppp')
        //console.log(ps)


        const flight_info = fs[0]
        const o_country = flight_info['origin_country']
        const d_country = flight_info['destination_country']
        console.log(o_country);
        console.log(d_country)
        if(o_country !== d_country) {
            console.log('different')
            const e = document.getElementById('vaccines')
            e.style.display = 'block'
            //this.setState({show: true})
            Axios.get(
              'https://australia-southeast1-seng3011-306108.cloudfunctions.net/country_vaccine?country_name=' + d_country,
              {
                  mode: 'cors',
                  method: 'get',
                  //headers: headers,
                  country_name: d_country
                }
            
            ).then(
                res => {
                    console.log(res.data.vaccines);
                    let array = []
                    for (let vaccine of res.data.vaccines) {
                        array.push(vaccine['name'])
                    }
                    const v = array.join(', ')
                    this.setState({ vaccines: v })
                    //this.setState({ vaccines: res.data.vaccines });
                }
            );
        }
    }

    render() {
      return (
          <>
            <Navbar />
            <div className="passenger-container">
                <Card id='vaccines' className="pas-card">
                    <Card.Body>
                        <h3>Vaccine Recommendations</h3>
                        <h5>{this.state.vaccines}</h5>
                    </Card.Body>
                </Card>
                {unique(this.state.passengers).map((p, index) => (
                    <Card className="pas-card">
                        <Card.Body>
                        {p}
                        <div>{"Vaccination History: " + unique(this.state.historys)[index]}</div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
          </>
      );
    }
}

const FlightDetails = compose(
	withRouter,
	withFirebase,
)(FlightDetailsBase);

export default FlightDetails
