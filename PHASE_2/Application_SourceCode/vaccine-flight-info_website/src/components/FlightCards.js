import React from 'react';
import './FlightCards.css';
import FlightCardItem from './FlightCardItem';

function FlightCards() {
  return (
    <div className='cards'>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <FlightCardItem 
							src='' 
							text = "Sydney Kingsford Smith Airport - Auckland Airport"
							path = '/mu7366passenger-details' 
							label='MU7366'
						/>
						</ul>
						<ul className='cards__items'>
            <FlightCardItem
							text="Indira Gandhi Airport - Velana International Airport "
							path = '/ai3401passenger-details' 
							label='AI3401'
            />
          </ul>
          <ul className='cards__items'>
            <FlightCardItem
							text="Houston Bush International - Denver International"
							path='/ual1100passenger-details' 
							label='UAL1100'
            />
						</ul>
					<ul className='cards__items'>
            <FlightCardItem
								text='Palm Beach International - Westchester County'
								path='/jbu1168passenger-details'
								label='JBU1168'
            />
						</ul>
						<ul className='cards__items'>
            <FlightCardItem
              text='John F Kennedy International - Haneda Airport'
              path='/jal3108passenger-details'
							label='JAL3108'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FlightCards;