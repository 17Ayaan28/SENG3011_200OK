const fetch = require("node-fetch");

var flight_info = {
	flights: [],
	carriers: [],
	places: []
};






const res = fetch("http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/FR/eur/en-US/PARI/NYC/2021-05-02?apiKey=prtl6749387986743898559646983194", { "method": "GET",
"headers": {
	"x-rapidapi-key": "0a96377de7msh3de3078377e3f3dp141743jsncf8d8b8800ae",
	"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
}
})
.then(response => response.json())
.then(function(data) {

	
	for(var i = 0; i < data.Quotes.length; i++) {

		var jso = {
			tod: "",
			carriers: [],
			origin: 0,
			destination: 0
		}

		jso.tod = data.Quotes[i].OutboundLeg.DepartureDate;
		jso.origin = data.Quotes[i].OutboundLeg.OriginId;
		jso.destination = data.Quotes[i].OutboundLeg.DestinationId;
		jso.carriers = data.Quotes[i].OutboundLeg.CarrierIds
		//console.log(typeof(data.Quotes[i].OutboundLeg.CarrierIds));

		

		flight_info.flights.push(jso);
		
	}

	for(var j = 0; j < data.Carriers.length; j++){
		flight_info.carriers.push(data.Carriers[j]);
	}

	for(var k = 0; k < data.Places.length; k++){

		flight_info.places.push(data.Places[k]);
		
	}

	for (var f = 0; f < flight_info.flights.length; f++){

		for (var n = 0; n < flight_info.places.length; n++){

			if(flight_info.flights[f].origin == flight_info.places[n].PlaceId){
				flight_info.flights[f].origin = flight_info.places[n].Name;
			}

			if(flight_info.flights[f].destination == flight_info.places[n].PlaceId){
				flight_info.flights[f].destination = flight_info.places[n].Name;
			}
		}
	}
	
	for (var f = 0; f < flight_info.flights.length; f++){

		for (var n = 0; n < flight_info.carriers.length; n++){

			//for(var o = 0; f < flight_info.flights[f].carriers.length; o++){

				if(flight_info.flights[f].carriers == flight_info.carriers[n].CarrierId){
					flight_info.flights[f].carriers = flight_info.carriers[n].Name;
				}
	//		}
		}
	}


	for (var t = 0; t < flight_info.flights.length; t++){
		console.log(flight_info.flights[t]);
	}

});


//for (i = 0; i <flights.flight.length; i++){
//	console.log(i);
//	console.log(flights.flight[i]);
//}




//console.log(data);
//})
//.catch(err => {
//	console.error(err);
//});

