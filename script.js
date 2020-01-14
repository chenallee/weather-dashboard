// DOM variables
var $searchForm = document.querySelector("#city-search");
var $searchInput = document.querySelector("#search-input");

//
var APIkey = "6aaa464bb00fa4a19aa146dac6e6844d";
var urlStart = "http://api.openweathermap.org/data/2.5/";
var searchHistory = [];

/* ----- FUNCTIONS ----- */
function searchHandler(searchTerm) {
  //call currentweather & UV AJAX request
  currentweatherSearch(searchTerm);
  //call 5Day AJAX request
  fivedaySearch(searchTerm);
}

//call current weather API
function currentweatherSearch(searchTerm) {
  //how should we handle returning false?
  console.log("Current| " + searchTerm);
  var cityCoords;
  var weatherUrl = urlStart + "weather?q=" + searchTerm + "&units=imperial&APPID=" + APIkey;

  $.ajax({
    url: weatherUrl,
    method: "GET"
  }).then(function (weatherResponse) {
    console.log(weatherResponse);
    //call function to create html elements showing response:

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
    console.log(uvResponse);
  });

}

//call forecast API
function fivedaySearch(searchTerm) {
  console.log("5| " + searchTerm);

}
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

