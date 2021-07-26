var apiKey = "44d934bc3830ac3f23662672055e4269";
var userFormEl = document.querySelector('#user-form');
var cityInputEl = document.querySelector('#city');
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
var historyEl = document.querySelector("#searchHistory");

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
        console.log(response);
      response.json().then(function(data){
        console.log(data);

      });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to open weather");
    });
};

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
