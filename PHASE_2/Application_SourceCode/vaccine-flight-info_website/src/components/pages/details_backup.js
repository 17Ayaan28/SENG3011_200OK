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
        console.log(flight_number)
        const flight_ref = this.props.firebase.db.ref(`flights/${flight_number}`);
        let fs = []
        let ps = []
        let hs = []
        flight_ref.on('value', (snapshot) => {
            //const id = snapshot.key
            snapshot.forEach((userSnapshot) => {

                // userData: fligt data {arrival_time, departure_time, flight_number, passenger_id}
                const userData = userSnapshot.val();
                console.log('*************')
                console.log(userData)
                const id = userData.passenger_id
                
                fs.push(userData)
                
                let history = []
                const p_ref = this.props.firebase.db.ref(`users/${uid}`)
                p_ref.on('value', (snapshot) => {
                    const userInfo = snapshot.val()
                    ps.push(userInfo)
                    
                    // Get history
                    const history_ref = this.props.firebase.db.ref(`v1/${id}`);
                    history_ref.on('value', (snapshot) => {
                        snapshot.forEach((userSnapshot) => {
                            const id = userSnapshot.key;
                            const userData = userSnapshot.val();
                            history.push(userData.disease);
                            console.log(userData)
                        });
                    })
                    history = history.join(', ')
                    hs.push(history)
                    //this.setState({ history: history });
                    //p['history'] = history
                    //ps.push(p)
                })
            });
        })
        console.log('@@@@@@@@@@@@@')
        console.log(hs)
        this.setState({ historys: hs })
        this.setState({ flights: fs })
        this.setState({ passengers: ps })
        //console.log('ppppppppppp')
        //console.log(ps)


        const flight_info = fs[0]
        const o_country = flight_info['origin_country']
        const d_country = flight_info['destination_country']
        console.log(o_country);
        console.log(d_country)
        if(o_country !== d_country) {
            console.log('different')
            this.setState({show: true})
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
            <Card id='vaccines'>
                <Card.Body>
                    <h3>Vaccine Recommendations:</h3>
                    <h5>{this.state.vaccines}</h5>
                </Card.Body>
            </Card>
            {this.state.passengers.map((p, index) => (
                <Card >
                    <Card.Body>
                      {p['first_name'] + ' ' + p['last_name']}
                      <div>{"Vaccination History: " + this.state.historys[index]}</div>
                    </Card.Body>
                </Card>
            ))}
          </>
      );
    }
}

const FlightDetails = compose(
	withRouter,
	withFirebase,
)(FlightDetailsBase);

export default FlightDetails