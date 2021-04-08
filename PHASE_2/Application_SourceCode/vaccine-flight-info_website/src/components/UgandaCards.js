import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Latest News on Uganda's Disease Outbreaks and International Travel </h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem 
                src='images/testkits.cms' 
                text = "Uganda launches Covid-19 rapid test kit, eyes African market"
                label = 'Covid-19 TestKits'
                path = 'https://health.economictimes.indiatimes.com/news/diagnostics/uganda-launches-covid-19-rapid-test-kit-eyes-african-market/81563914' 
            />
            <CardItem
                src='images/vaccination-uganda.webp' 
                text="Uganda to Begin Nationwide COVID Vaccinations Wednesday"
                label = 'Vaccination'
                path = 'https://www.voanews.com/covid-19-pandemic/uganda-begin-nationwide-covid-vaccinations-wednesday' 
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
                 src='images/uganda-travel-influencers.jpg' 
                  text="Tourism board to employ local, international influencers to market Uganda"
                  label='Travel'
                    path='https://www.monitor.co.ug/uganda/lifestyle/travel/tourism-board-to-employ-local-international-influencers-to-market-uganda-3352770' 
            />
            <CardItem
                    src='images/uganda-travel-cancel.jpg' 
                  text='Nigeria, South Africa, Uganda, Tanzania hit by U-17 Afcon cancellation'
                  label='Travel'
                  path='https://www.goal.com/en-in/news/nigeria-south-africa-uganda-tanzania-hit-by-u-17-afcon/g1cmipg5qgfq1mcjv1cx9de74'
            />
            <CardItem
                    src='images/corona-variant.jpg' 
                  text='Ugandan Covid-19 variant has mutations associated with higher transmissibility but there is no compelling evidence yet'
                  label='Covid-19'
                  path='https://www.baltictimes.com/ugandan_covid-19_variant_has_mutations_associated_with_higher_transmissibility_but_there_is_no_compelling_evidence_yet_-_dumpis/'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;