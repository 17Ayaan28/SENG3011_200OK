const fetch = require("node-fetch");


const res = fetch("http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/FR/eur/en-US/CMB/NYC/2021-05-02?apiKey=prtl6749387986743898559646983194", { "method": "GET",
"headers": {
	"x-rapidapi-key": "0a96377de7msh3de3078377e3f3dp141743jsncf8d8b8800ae",
	"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com"
}
})
.then(response => response.json())
.then(function(data) {
	console.log(data);
});




//console.log(data);
//})
//.catch(err => {
//	console.error(err);
//});

