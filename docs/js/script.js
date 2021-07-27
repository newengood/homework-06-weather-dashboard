// Declare Variables

//api key
var apiKey = "44d934bc3830ac3f23662672055e4269";

// Search function variables
var userFormEl = document.querySelector("#user-form");
var historyEl = document.querySelector("#searchHistory");
var cityInputEl = document.querySelector("#city");
var weatherSearchTerm = document.querySelector("#weather-search-term");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

// current forecast variables
var tempContainerEl = document.querySelector("#temp-container");
var windContainerEl = document.querySelector("#wind-container");
var humidityContainerEl = document.querySelector("#humidity-container");
var uvContainerEl = document.querySelector("#uv-container");

// five day forecast variables
var forecastEl = document.querySelectorAll(".forecast")

// Function to handle search input
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

// Function to retrieve weather data from third pary weather app 
var getWeather = function (cityName) {
  var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;
  
  fetch(apiURL)
    .then(function (response) {
      if(response.ok) {
        // console.log(response);
      response.json().then(function(data){
        console.log(data);
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

// Function to display the five day forecast
var displayForecast = function(weatherData, cityName) {
  var lat = weatherData.coord.lat;
  var lon = weatherData.coord.lon;

  // Use a different api call that gives forecast information
  var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  fetch(apiURL)
  .then(function (response) {
    if(response.ok) {
      response.json().then(function(data){
        for (var i = 0; i < forecastEl.length; i++) {
          forecastEl[i].innerHTML = "";
      
          var forecastDate = moment.unix(data.daily[i].dt).format("M/D/Y");
          
          var humidityEl = document.createElement("p");
          var windEl = document.createElement("p");
          var temperatureEl = document.createElement("p");
          var weatherIconEl = document.createElement("img");
          forecastDateEl = document.createElement("p");
          
          weatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
          temperatureEl.innerHTML = "Temp :" + ((data.daily[i].temp.day - 273.15) * 1.8 + 32).toFixed(2) + "℉";
          windEl.innerHTML = "Wind: " + data.daily[i].wind_speed + "MPH";
          humidityEl.innerHTML = "Humidity :" + data.daily[i].humidity + "%";

          forecastEl[i].append(forecastDate);
          forecastEl[i].append(weatherIconEl);
          forecastEl[i].append(temperatureEl);
          forecastEl[i].append(windEl);
          forecastEl[i].append(humidityEl);

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

// function to display the current weather of searched city
var displayWeather = function(weatherData, cityName) {
  var currentDate = moment().format("(M/D/Y)");

  var weatherIconEl = document.createElement("img");
  weatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png");

  weatherSearchTerm.textContent = cityName + " " + currentDate;
  weatherSearchTerm.append(weatherIconEl);

  var temp = "Temp: " + ((weatherData.main.temp - 273.15) * 1.8 + 32).toFixed(2) + "℉";
  var wind = "Wind: " + weatherData.wind.speed + " MPH";
  var humidity = "Humidity :" + weatherData.main.humidity + "%";

  var lat = weatherData.coord.lat;
  var lon = weatherData.coord.lon;

  var apiURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  fetch(apiURL)
  .then(function (response) {
    if(response.ok) {
      response.json().then(function(data){
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

// function to display UV information and color baed on value
var displayUV = function(weatherData) {
  var uv = "UV Index: " + weatherData.current.uvi;

  uvContainerEl.textContent = uv;

  if (weatherData.current.uvi <= 2) {
      document.getElementById("uv-container").style.backgroundColor = "green";
      document.getElementById("uv-container").style.color = "white";
  }
  else if (weatherData.current.uvi <= 5) {
      document.getElementById("uv-container").style.backgroundColor = "yellow";
      document.getElementById("uv-container").style.color = "black";
  }
  else if (weatherData.current.uvi <= 10) {
    document.getElementById("uv-container").style.backgroundColor = "red";
    document.getElementById("uv-container").style.color = "white";
  }
  else {
    document.getElementById("uv-container").style.backgroundColor = "darkred";
    document.getElementById("uv-container").style.color = "white";
  }
}

// Fcuntion to render search history and search if clicked
function renderSearchHistory(event) {
  historyEl.innerHTML = "";
  for (var i = 0; i < searchHistory.length; i++) {

    var historyItem = document.createElement("input");
    historyItem.setAttribute("type","text");
    historyItem.setAttribute("readonly", true)
    historyItem.setAttribute("class", "form-input")
    historyItem.setAttribute("value", searchHistory[i]);
    historyEl.append(historyItem);

    historyItem.addEventListener("click", function (event) {
      event.preventDefault();

      getWeather(event.target.value);
    });
  }
}

//display search history from local storage and handle search cick
renderSearchHistory();
userFormEl.addEventListener("submit", formSubmitHandler);
