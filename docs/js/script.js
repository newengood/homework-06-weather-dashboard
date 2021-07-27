var apiKey = "44d934bc3830ac3f23662672055e4269";
var userFormEl = document.querySelector('#user-form');
var historyEl = document.querySelector("#searchHistory");
var cityInputEl = document.querySelector('#city');
var weatherSearchTerm = document.querySelector("#weather-search-term");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

var tempContainerEl = document.querySelector("#temp-container");
var windContainerEl = document.querySelector("#wind-container");
var humidityContainerEl = document.querySelector("#humidity-container");
var uvContainerEl = document.querySelector("#uv-container");

var forecastEl = document.querySelectorAll(".forecast")


var formSubmitHandler = function (event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();
  if (city) {
    getWeather(city);
    searchHistory.push(city);
    localStorage.setItem("search",JSON.stringify(searchHistory));
  renderSearchHistory();
  }
};

var getWeather = function (cityName) {
  var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
  
  fetch(apiURL)
    .then(function (response) {
      if(response.ok) {
        // console.log(response);
      response.json().then(function(data){
        // console.log(data);
        displayWeather(data, cityName);
        displayForecast(data, cityName);
      });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to open weather");
    });
};

var displayForecast = function(weatherData, cityName) {
  var lat = weatherData.coord.lat;
  var lon = weatherData.coord.lon;

  var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  fetch(apiURL)
  .then(function (response) {
    if(response.ok) {
      // console.log(response);
      response.json().then(function(data){
        console.log(data);;
        for (var i = 0; i < forecastEl.length; i++) {
          console.log(data);
          forecastEl.innerHTML = "";
      
          var forecastDate = moment.unix(data.daily[i].dt).format("M/D/Y");

          forecastDateEl = document.createElement("p");

          forecastEl[i].append(forecastDate);

        }
      });
    } else {
      alert("Error: " + response.statusText);
    }
  })
  .catch(function(error) {
    alert("Unable to connect to open weather");
  });
}

var displayWeather = function(weatherData, cityName) {
  var currentDate = moment().format("(M/D/Y)");
  weatherSearchTerm.textContent = cityName + " " + currentDate;
  // console.log(weatherData);
  var temp = "Temp: " + ((weatherData.main.temp - 273.15) * 1.8 + 32).toFixed(2) + "℉";
  var wind = "Wind: " + weatherData.wind.speed + " MPH";
  var humidity = "Humidity :" + weatherData.main.humidity + "%";

  var lat = weatherData.coord.lat;
  var lon = weatherData.coord.lon;

  var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  fetch(apiURL)
  .then(function (response) {
    if(response.ok) {
      // console.log(response);
      response.json().then(function(data){
        // console.log(data);
        displayUV(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  })
.catch(function(error) {
  alert("Unable to connect to open weather");
});

  tempContainerEl.textContent = temp;
  windContainerEl.textContent = wind;
  humidityContainerEl.textContent = humidity;  
};

var displayUV = function(weatherData) {
  // console.log(weatherData);
  var uv = "UV Index: " + weatherData.current.uvi;

  uvContainerEl.textContent = uv;
}

function renderSearchHistory() {
  historyEl.innerHTML = "";
  for (var i = 0; i < searchHistory.length; i++) {
    var historyItem = document.createElement("input");
    historyItem.setAttribute("type","text");
    historyItem.setAttribute("readonly", true)
    historyItem.setAttribute("class", "form-input")
    historyItem.setAttribute("value", searchHistory[i]);
    historyEl.append(historyItem);
  }
}

renderSearchHistory();
userFormEl.addEventListener('submit', formSubmitHandler);
