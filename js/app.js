(function() {
    var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
    var DARKSKY_API_KEY = 'e1f4da53d6f0d0889607627a1fe13360';
    var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
    
    var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
    var GOOGLE_MAPS_API_KEY = 'AIzaSyBdpDOpjoue2bvABv9xSdYY6SDdwvtKM30';
    var FORMATTED_ADDRESS = '';
    
    
    
    // This function returns a promise that will resolve with an object of lat/lng coordinates
    function getCoordinatesForCity(cityName) {
        // This is an ES6 template string, much better than verbose string concatenation...
        var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;
        
        return (
            fetch(url) // Returns a promise for a Response
            .then(response => response.json()) // Returns a promise for the parsed JSON
            .then(data => {
                FORMATTED_ADDRESS = data.results[0]['formatted_address'];
                return data.results[0].geometry.location;
            }) // Transform the response to only take what we need
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
    
    var locationAddress = app.querySelector('.location-address');
    var currentWeather = app.querySelector('.current-weather');
    var currentTemperature = app.querySelector('.current-temperature');
    
    cityForm.addEventListener('submit', function() {
        event.preventDefault();
        
        var city = cityInput.value; // Grab the current value of the input
        
        getCoordinatesForCity(city) // get the coordinates for the input city
        .then(getCurrentWeather) // get the weather for those coordinates
        .then(function(weather) { // set the current temperature display
            locationAddress.style.visibility = "visible";
            locationAddress.innerHTML = 'Weather For: ' + FORMATTED_ADDRESS;
            
            currentWeather.style.visibility = "visible";
            currentWeather.innerHTML = 'Current Weather: ' + weather.summary + '&nbsp;';
            
            currentTemperature.style.visibility = "visible";
            currentTemperature.innerHTML = 'Current Temperature: ' + weather.temperature + ' &deg;C ';
            console.log(weather.icon);
            switch(weather.icon) {
                case 'clear-day':
                    document.body.style.backgroundImage = "url('images/clear.jpg')";
                    break;
                case 'clear-night':
                    document.body.style.backgroundImage = "url('images/clear-night.jpg')";
                    break;
                case 'rain':
                    document.body.style.backgroundImage = "url('images/rain.jpg')";
                    break;
                case 'snow':
                    document.body.style.backgroundImage = "url('images/snow.jpg')";
                    break;
                case 'sleet':
                    document.body.style.backgroundImage = "url('images/sleet.jpg')";
                    break;
                case 'wind': 
                case 'cloudy':
                case 'partly-cloudy-day':
                case 'partly-cloudy-night':
                    document.body.style.backgroundImage = "url('images/cloudy.jpg')";
                    break;
                case 'fog':
                    document.body.style.backgroundImage = "url('images/fog.jpg')";
                    break;
                default:
                    document.body.style.backgroundImage = "url('images/default.jpg')";
            }
        });
    });
    
    google.maps.event.addDomListener(window, 'load', function () {
        var places = new google.maps.places.Autocomplete(document.querySelector('.city-input'));
    });
})();