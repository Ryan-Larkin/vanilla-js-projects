(function() {
    var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
    var DARKSKY_API_KEY = 'e1f4da53d6f0d0889607627a1fe13360';
    var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
    
    var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
    var GOOGLE_MAPS_API_KEY = 'AIzaSyBdpDOpjoue2bvABv9xSdYY6SDdwvtKM30';
    
    // This function returns a promise that will resolve with an object of lat/lng coordinates
    function getCoordinatesForCity(cityName) {
        // This is an ES6 template string, much better than verbose string concatenation...
        var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;
        
        return (
            fetch(url) // Returns a promise for a Response
            .then(response => response.json()) // Returns a promise for the parsed JSON
            .then(data => data.results[0].geometry.location) // Transform the response to only take what we need
        );
    }
    
    function getCurrentWeather(coords) {
        // Template string again! I hope you can see how nicer this is :)
        var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;
        
        return (
            fetch(url)
            .then(response => response.json())
            .then(data => data.currently)
        );
    }
    
    var app = document.querySelector('#app');
    var cityForm = app.querySelector('.city-form');
    var cityInput = cityForm.querySelector('.city-input');
    var cityWeather = app.querySelector('.city-weather');
    
    cityForm.addEventListener('submit', function() {
        event.preventDefault();
        
        var city = cityInput.value; // Grab the current value of the input
        
        getCoordinatesForCity(city) // get the coordinates for the input city
        .then(getCurrentWeather) // get the weather for those coordinates
        .then(function(weather) { // set the current temperature display
            cityWeather.innerText = 'Current temperature: ' + weather.temperature;
        });
    });
})();