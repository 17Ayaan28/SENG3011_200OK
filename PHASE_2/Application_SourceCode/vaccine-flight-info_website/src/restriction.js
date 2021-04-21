import React from 'react'
import Navbar from './components/Navbar';
import './restriction.css'
import Axios from 'axios'
import ReadMoreReact from 'read-more-react';
import country_convert from './country_convert.json';
import restriction_country from './restriction_country.json';



class Restriction extends React.Component {

    state = {
		country: undefined,
		restrictions: []
	}

    componentDidMount() {
		const country = this.props.match.params.country;
		//console.log(country)
        //console.log(typeof(country_convert))
        //const front_end_name = country_convert.find(x => x['cdc_name'] === country)[0]
        let front_end_name = country;
        for(let key in country_convert) {
            //console.log(key)
            if(key === country) {
                //console.log('222')
                front_end_name = country_convert[key]['front_end_name'];
            } 
        }
        console.log(front_end_name)
        this.setState({ country: front_end_name })
        const name = restriction_country[front_end_name]['name']
        const region = restriction_country[front_end_name]['region']
        console.log(name)
        console.log(region)
        //?country_name=china&country_region=asia
        Axios.get(
            'https://australia-southeast1-seng3011-306108.cloudfunctions.net/travel_restriction?country_name=' + name + '&country_region=' + region,
            {
                method: 'GET',
                mode: 'cors',
                country_name: name,
                country_region: region
            }
        )
        .then(
            res => {
                //console.log(res.data.info)
                this.setState({ restrictions: res.data.info.split('\n') })
                //console.log(res.data.info.split('\n'))
            }
        )
        .catch(errors => {
            console.log('fk fk fk')
        });
		//this.setState({ country: this.props.location.display_country_name })
        //console.log(this.props.location.display_country_name)
        
	}

	render() {
        return(
        <div>
        <Navbar />
        <h2 className="restriction res-title ">Travel Restrictions</h2>
        <div className="restriction">
            <div className="cardContainer">
                <div className="card border-dark mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{"Can You Enter " + this.state.country + '?'}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{""}</h6>                    
                            {this.state.restrictions.map(r => (
                                <p className="card-text"> 
                                    {r}
                                </p>
                            ))}
                    </div>
                </div>
            </div>
        </div>
        </div>
        );
    }
}

export default Restriction;