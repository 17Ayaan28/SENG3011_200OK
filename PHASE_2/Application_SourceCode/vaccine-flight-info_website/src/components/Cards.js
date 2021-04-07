import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Latest News on vaccines and interational travel!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem 
							src='images/covid-passport.jpg' 
							text = "Clarity still needed for  effectiveness of COVID-19 vaccine passports, says UN health agency"
							label = 'Vaccine'
							path = 'https://news.un.org/en/story/2021/04/1089082' 
						/>
            <CardItem
							src='images/russia_news.webp' 
              text="Russia registers world's first Covid-19 vaccine for animals"
              label = 'Vaccine'
							path = 'https://www.indiatoday.in/coronavirus-outbreak/vaccine-updates/story/russia-world-first-covid-19-vaccine-animals-1787543-2021-04-06' 
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
							src='images/borris.webp' 
              text="Boris Johnson eases lockdown but foreign travel on hold for UK"
              label='Travel'
              path='https://economictimes.indiatimes.com/news/international/world-news/boris-johnson-eases-lockdown-but-foreign-travel-on-hold-for-uk/articleshow/81924271.cms' 
            />
            <CardItem
							src='images/thailand.jpg' 
              text='Thailand has a new travel plan for vaccinated travellers'
              label='Travel'
              path='https://timesofindia.indiatimes.com/travel/travel-news/thailand-has-a-new-travel-plan-for-vaccinated-travellers/as81935986.cms'
            />
            <CardItem
							src='images/covid19vaccine.jpeg' 
              text='Get vaccinated quickly to roam around around your favourite destination '
              label='Covid-19'
              path='/'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;