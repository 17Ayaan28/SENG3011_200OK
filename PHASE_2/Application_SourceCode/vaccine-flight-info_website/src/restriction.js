import React from 'react'
import Navbar from './components/Navbar';
import './restriction.css'
import Axios from 'axios'
import ReadMoreReact from 'read-more-react'



class Restriction extends React.Component {

    state = {
		country: undefined,
		news: []
	}

    componentDidMount() {
		const country = this.props.match.params.country;
		console.log(country)
		this.setState({ country: this.props.location.display_country_name })

		Axios.get(
			'https://events4fe.herokuapp.com/articles?start_date=2017-01-01T10%3A12%3A20&end_date=2021-10-10T10%3A22%3A30&country='+ country + "&limit=9",
			{
				mode: 'cors',
				method: 'get',
				country: country,
                limit: 9
			}
		
		).then(
			res => {
                console.log(res.data)
				this.setState({ news: res.data });
			}
		);
	}

	render() {
        return(
        <div>
        <Navbar />
        <h2 className="restriction res-title">Travel Restrictions</h2>
        <div className="restriction">
            <div className="cardContainer">
                <div class="card border-dark mb-3">
                    <div class="card-body">
                        <h5 class="card-title">{"restriction"}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{"subtitle"}</h6>
                        <p class="card-text">                       
                            {"maintext"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </div>
        );
    }
}

export default Restriction;