//variable to store the searched city
var city = "";
// variables assignment
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty = $("#humidity");
var currentWSpeed = $("#wind-speed");
var currentUvindex = $("#uv-index");
var sCity = [];

// API key
var APIKey = "f1e7d20dfa74228e56b0e5bfdd014432";
// grabs the city input and displays the current/5day forecast to the user
function displayWeather(event) {
  event.preventDefault();
  if (searchCity.val().trim() !== "") {
    city = searchCity.val().trim();
    currentWeather(city);
  }
}

// AJAX call
function currentWeather(city) {
  // URL build to grab information from API
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {

    console.log(response);

    //weather icon
    var weathicon = response.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/wn/" + weathicon + "@2x.png";
    // date structure
    var date = new Date(response.dt * 1000).toLocaleDateString();
    // Concatenating city name and icon 
    $(currentCity).html(response.name + "(" + date + ")" + "<img src=" + iconurl + ">");

    // adding temp and converting it to fahrenheit
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    $(currentTemperature).html((tempF).toFixed(2) + "&#8457");
    // Display the Humidity
    $(currentHumidty).html(response.main.humidity + "%");

    //Display Wind speed and convert to MPH
    var ws = response.wind.speed;
    var windsmph = (ws * 2.237).toFixed(1);
    $(currentWSpeed).html(windsmph + "MPH");

    // UVIndex using cordinates 

    UVIndex(response.coord.lon, response.coord.lat);
    forecast(response.id);
    if (response.cod == 200) {
      sCity = JSON.parse(localStorage.getItem("cityname"));
      console.log(sCity);
      if (sCity == null) {
        sCity = [];
        sCity.push(city.toUpperCase()
        );
        localStorage.setItem("cityname", JSON.stringify(sCity));
        addToList(city);
      }
      else {
        if (find(city) > 0) {
          sCity.push(city.toUpperCase());
          localStorage.setItem("cityname", JSON.stringify(sCity));
          addToList(city);
        }
      }
    }

  });
}
// function to return UV index response
function UVIndex(ln, lt) {
  //UVindex url build
  var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lt + "&lon=" + ln;
  $.ajax({
    url: uvURL,
    method: "GET"
  }).then(function (response) {
    $(currentUvindex).html(response.value);
  });
}