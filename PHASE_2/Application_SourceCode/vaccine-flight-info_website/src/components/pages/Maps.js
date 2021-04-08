import React from 'react'
import '../../App.css'
import Navbar from '../Navbar'
import './Maps.css'

export default function Maps() {
    return (
    <>
        <Navbar />
        <img src ='images/hospital-map.jpg' className='hospital-maps'/>
        <div className='hospsDiv'>
        <h3 id='hospitalNames'> Hospitals in your locality </h3>
        <ul className='hosps'>
            <li>
                Apollo Hospital - VGN
            </li>
            <li>
                CARE Hospital
            </li>
            <li>
                OMNI Hospital
            </li>
            <li>
                Apollo Hospital - Main
            </li>
            <li>
                Aware Gleneagles Global Hospital
            </li>    
            
        </ul>
        </div>
    </>
    );
}
