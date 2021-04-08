import React from "react";
//import {Link} from "react-router-dom";
//import Page2 from "./Page2";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Navbar from './components/Navbar'
import './TravelInfo.css'
import Cards from './components/Cards'
import { Link } from "react-router-dom";
function TravelInfo() {

    return (
		<>
		<Navbar />
		<p>
          <h1 id="travel_head">Vaccinations for Travel to Uganda<br />
		  <Link to='/uganda-news'>
		  <button className="newss" type='button'>Outbreaks Info and News</button> 
		  </Link>

		  <Link to='/maps'>
		  <button className="mapss" type='button'>Maps</button> 
		  </Link>
		  </h1>
        </p>
		
      <div className="vaccine-table">
		

		<Table id="travel_table" striped bordered hover>
		  <thead>
		    <tr>
		      <th>#</th>
		      <th>Disease</th>
		      <th>CDC Advise</th>
		      <th>Vaccine Name</th>
		    </tr>
		  </thead>
		  <tbody>
		    <tr>
		      <td>1</td>
		      <td>Cholera</td>
		      <td>Vaccination may be considered for adults who are traveling to areas of active cholera transmission. Areas of active cholera transmission are localized to the Northern region in Uganda. Cholera is rare in travelers but can be severe. Certain factors may increase the risk of getting cholera or having severe disease (more information). Avoiding unsafe food and water and washing your hands can also help prevent cholera.</td>
		      <td>Vaxchora® (lyophilized CVD 103-HgR), Dukoral, Shanchol,</td>
		    </tr>
		    <tr>
		      <td>2</td>
		      <td>Hepatitis-A</td>
		      <td>Recommended for unvaccinated travelers one year old or older going to Uganda.

Infants 6 to 11 months old should also be vaccinated against Hepatitis A. The dose does not count toward the routine 2-dose series.

Travelers allergic to a vaccine component or who are younger than 6 months should receive a single dose of immune globulin, which provides effective protection for up to 2 months depending on dosage given.

Unvaccinated travelers who are over 40 years old, immunocompromised, or have chronic medical conditions planning to depart to a risk area in less than 2 weeks should get the initial dose of vaccine and at the same appointment receive immune globulin.</td>
		      <td>Avaxim, Biovac-A, Epaxal, Havrix, Twinrix, VAQTA</td>
		    </tr>
		    <tr>
		      <td>3</td>
		      <td>Hepatitis B</td>
		      <td>Recommended for unvaccinated travelers of all ages to Uganda.</td>
		      <td>Comvax, ComBE Five, Easyfive TT, Elovac B, Engerix-B, Genevac B, Pediarix, Pentabio, Pentavac PFS, Quinvaxem, Recombivax HB, Sci-B-Vac, Shan-5, Shanvac B, Twinrix</td>
		    </tr>

		    <tr>
		      <td>4</td>
		      <td>Malaria</td>
		      <td>CDC recommends that travelers going to Uganda take prescription medicine to prevent malaria. Depending on the medicine you take, you will need to start taking this medicine multiple days before your trip, as well as during and after your trip. Talk to your doctor about which malaria medication you should take.</td>
		      <td></td>
		    </tr>

		    <tr>
		      <td>5</td>
		      <td>Measles</td>
		      <td>Infants 6 to 11 months old traveling internationally should get 1 dose of measles-mumps-rubella (MMR) vaccine before travel. This dose does not count as part of the routine childhood vaccination series.</td>
		      <td>Avaxim, Biovac-A, Epaxal, Havrix, Twinrix, VAQTA</td>
		    </tr>

		    <tr>
		      <td>6</td>
		      <td>Meningitis</td>
		      <td>Recommended for travelers 2 months old or older traveling to Uganda during the dry season (December to June).</td>
		      <td>Serotype C: Neisvac C and Meningitec. Serotypes A/C/W-135/Y: Mencevax, Nimenrix, Menveo, Menactra. Serotype B: Bexsero</td>
		    </tr>
		    <tr>
		      <td>7</td>
		      <td>Rabies</td>
		      <td>Abhayrab, Imovax, RabAvert, Rabipur, Rabivax, Speeda, Verovab</td>
		    </tr>

		    <tr>
		      <td>8</td>
		      <td>Typhoid</td>
		      <td>Recommended for most travelers, especially those staying with friends or relatives or visiting smaller cities or rural areas.</td>
		      <td>Typhim Vi, Typherix, Ty21a</td>
		    </tr>
		    <tr id="color">
		      <td>9</td>
		      <td>Yellow Fever</td>
		      <td>Required for arriving travelers from all countries if traveler is ≥1 year of age. Recommended for all travelers ≥9 months of age.</td>
		      <td>Stamaril, YF-VAX</td>
		    </tr>
		  </tbody>
		</Table>
      </div>
	  </>
    );

}

export default TravelInfo;