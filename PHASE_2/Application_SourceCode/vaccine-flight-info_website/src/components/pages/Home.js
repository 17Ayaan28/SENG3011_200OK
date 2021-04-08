import React from 'react'
import '../../App.js'
import VidSlide from '../VidSlide'
import Cards from '../Cards'
import Navbar from '../Navbar';


function Home() {
    return(
        <div>
            <Navbar />
            <VidSlide />
            {/* <Cards /> */}
        </div>
    );
}

export default Home;
