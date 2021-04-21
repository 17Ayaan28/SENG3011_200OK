import React from 'react'
import '../../App.css'
import Navbar from '../Navbar'
import ReadMoreReact from 'read-more-react'
import './NewsOutbreaks.css'
import UgandaCards from '../UgandaCards'
import Axios from 'axios'


class NewsOutbreaks extends React.Component {

    state = {
		country: undefined,
		news: []
	}

    componentDidMount() {
		const country = this.props.match.params.country;
		console.log(country)
		this.setState({ country: this.props.location.display_country_name })
        /*
        const options = {
            method: 'GET',
			url: 'https://events4fe.herokuapp.com/articles?start_date=2017-01-01T10%3A12%3A20&end_date=2021-10-10T10%3A22%3A30&country='+ country + "&limit=9",
            params: {country: country, limit: 9},
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            }
        };

        Axios.request(options)
        .then(
            res => {
                console.log('yes')
            }
        )
        */

		Axios.get(
			'https://events4fe.herokuapp.com/articles?start_date=2017-01-01T10%3A12%3A20&end_date=2021-10-10T10%3A22%3A30&country='+ country + "&limit=9",
			{
				mode: 'cors',
				method: 'get',
				country: country,
                limit: 9,
                'Access-Control-Allow-Origin': 'http://localhost:3000'
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
        <h2 className="outbreaks out-title">Recent News</h2>
        <div className="outbreaks card-columns">
            {this.state.news.map(news => (
                <div className="cardContainer">
                    <div class="card border-dark mb-3">
                        <div class="card-body" id="newsBody">
                            <h5 class="card-title" id="news-title">{news['title']}</h5> 
                            <h6 class="card-subtitle mb-2 text-muted">{news['date_of_publication'].replace("T", "  ")}</h6> <br />
                            <p class="card-text">                       
                                <ReadMoreReact text={news['maintext']}
                                    min={100}
                                    ideal={500}
                                    max={900}
                                    readMoreText="[read more]"
                                />
                            </p>
                            <a href={news['url']} class="card-link">Source Page</a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </div>
        );
    }
}

export default NewsOutbreaks;

