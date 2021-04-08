import React from 'react';
import '../App.css';
import { Button } from './Button';
import './VidSlide.css';

function VidSlide() {
  return (
    <div className='hero-container'>
      <video src='/images/mockup.mp4' autoPlay loop muted/>
      <h1>YOUR DESTINATION AWAITS</h1>
      <p>Get vaccinated and arrive at your destination safely</p>
      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          <b>GET STARTED</b>
        </Button>
      </div>
    </div>
  );
}

export default VidSlide;