// DOM variables
var $searchForm = document.querySelector("#city-search");
var $searchInput = document.querySelector("#search-input");
var $weatherCard = document.querySelector("#current-weather");

// variables for APIs
var APIkey = "6aaa464bb00fa4a19aa146dac6e6844d";
var urlStart = "http://api.openweathermap.org/data/2.5/";

//
var searchHistory = [];

/* ----- FUNCTIONS ----- */
//add search term to history [] & local storage

//update search history display from local storage

//handle clearing response divs and calling functions to search APIs
function searchHandler(searchTerm) {
  //clear results divs:

  //call currentweather & UV AJAX request:
  currentweatherSearch(searchTerm);
  //call 5Day AJAX request:
  fivedaySearch(searchTerm);
}

//call current weather API
function currentweatherSearch(searchTerm) {
  //how should we handle returning false?
  //console.log("Current| " + searchTerm);
  var cityCoords;
  var weatherUrl = urlStart + "weather?q=" + searchTerm + "&units=imperial&APPID=" + APIkey;

  $.ajax({
    url: weatherUrl,
    method: "GET"
  }).then(function (weatherResponse) {
    //console.log(weatherResponse);
    //call function to create html elements showing response:
    displayCurrentweather(weatherResponse);

    //send coordinates to UV search for API call
    cityCoords = weatherResponse.coord;
    currentUVSearch(cityCoords);
  });  
}

//call current UV API
function currentUVSearch(cityCoords) {
  // console.log("UV| ");
  // console.log(cityCoords);
  //create string of coords to use as parameters for UV API call
  var searchCoords = "lat=" + cityCoords.lat + "&lon=" + cityCoords.lon;
  // console.log(searchCoords);
  var uvUrl = urlStart + "uvi?" + searchCoords + "&APPID=" + APIkey;

  $.ajax({
    url: uvUrl,
    method: "GET"
  }).then(function(uvResponse){
    //console.log(uvResponse);
    //call function to create html element for uv response:
    displayCurrentUV(uvResponse);
  });

}

//call forecast API
function fivedaySearch(searchTerm) {
  console.log("5| " + searchTerm);

  var forecastUrl = urlStart + "forecast?q=" + searchTerm + "&units=imperial&APPID=" + APIkey;

  //maybe use 16-day instead and limit to 5 bc it's averages instead of 3-hr
  $.ajax({
    url: forecastUrl,
    method: "GET"
  }).then(function(forecastResponse){
    console.log(forecastResponse);
  });

}

//add current weather response to page:
function displayCurrentweather(weatherResponse){
  console.log(weatherResponse);
  //h1 with city name, date, weather icon
  var $weatherHeader = document.createElement("h1");
  //var toDay = new Date();
  //var currentDate = "(" + Date.prototype.getMonth() + "/" + Date.prototype.getDate() + "/" + Date.prototype.getFullYear() + ")";
  //moment might be easier
  $weatherHeader.textContent = weatherResponse.name;
  
  var $weatherIcon = document.createElement("img");
  $weatherIcon.setAttribute("src", "http://openweathermap.org/img/w/" + weatherResponse.weather[0].icon + ".png")

  $weatherHeader.appendChild($weatherIcon);

  var $weatherTemp = document.createElement("div");
  $weatherTemp.textContent = "Temperature: " + (weatherResponse.main.temp) + " F°";

  var $weatherHumid = document.createElement("div");
  $weatherHumid.textContent = "Humidity: " + (weatherResponse.main.humidity) + "%";

  var $weatherWind = document.createElement("div");
  $weatherWind.textContent = "Wind Speed: " + (weatherResponse.wind.speed) + " MPH";

  $weatherCard.appendChild($weatherHeader);
  $weatherCard.appendChild($weatherTemp);
  $weatherCard.appendChild($weatherHumid);
  $weatherCard.appendChild($weatherWind);
  
}

//add UV index response to page:
function displayCurrentUV(uvResponse){
  var $weatherUV = document.createElement("div");
  $weatherUV.textContent = "UV Index: " + (uvResponse.value);

  $weatherCard.appendChild($weatherUV);
  $weatherCard.classList.remove("hide");

}

//add 5Day forecast response to page:

/* ----- EVENT LISTENERS ----- */
//on form submit, get text typed and then pass it to other functions
$searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var searchTerm = $searchInput.value.trim();
  if (!searchTerm) {
    return false;
  }
  console.log(searchTerm);
  //first: send it to search weather API
  searchHandler(searchTerm);

  //next: clear input
  $searchInput.value = "";

  //then: add term to history []

  //finally: update history display
});

