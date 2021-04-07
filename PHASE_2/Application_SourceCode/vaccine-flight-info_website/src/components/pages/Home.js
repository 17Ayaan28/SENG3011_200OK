import React from 'react'
import '../../App.js'
import VidSlide from '../VidSlide'
import Cards from '../Cards'
import Navbar from '../Navbar';


function Home() {
    return(
        <>
            <Navbar />
            <VidSlide />
            <Cards />
        </>
    );
}

export default Home;
