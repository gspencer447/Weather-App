const API_KEY = "6ba521e04dcca23e89b903aa5087600d";
const API_URL =
  "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=" +
  API_KEY;

class SelectedAreas {
  constructor() {
    this.areas = JSON.parse(localStorage.getItem("selectedAreas")) || [];

    this.addArea = function (area) {
      this.areas.push(area);
      this.saveAreas();
    };

    this.removeArea = function (area) {
      var index = this.areas.indexOf(area);
      if (index !== -1) {
        this.areas.splice(index, 1);
        this.saveAreas();
      }
    };

    this.saveAreas = function () {
      localStorage.setItem("selectedAreas", JSON.stringify(this.areas));
    };
  }
}

var selectedAreas = new SelectedAreas();
console.log(selectedAreas.areas);
let refresh = false;
let showing = false;
var favoriteAreas = document.getElementById("SelectedAreas");
let show = (refresh, shown) => {
  console.log(refresh, shown)
  if (refresh == false && shown == false) {
    selectedAreas.areas.map((area, ind) => {
      let div = document.createElement("div");
      div.className = `${area}${ind}`;
      let location = document.createElement("p");
      location.textContent = `${area}`;
      let temp = document.createElement("button");
      temp.textContent = "Temperature";
      let remove = document.createElement("button");
      remove.textContent = "Remove";
      div.appendChild(location);
      div.appendChild(temp);
      div.appendChild(remove);
      favoriteAreas.appendChild(div);
      temp.addEventListener("click", (e) => {
        fetchSelectedAreasWeather(area);
      });
      remove.addEventListener("click", (e) => {
        favoriteAreas.removeChild(div);
        selectedAreas.removeArea(area);
      });
    });
    refresh= true;
    showing = true;
    console.log(refresh, showing)
  } else if (refresh && shown) {
    
    while(favoriteAreas.lastChild){
      favoriteAreas.removeChild(favoriteAreas.lastChild)
    }
    selectedAreas.areas.map((area, ind) => {
      let div = document.createElement("div");
      div.className = `${area}${ind}`;
      let location = document.createElement("p");
      location.textContent = `${area}`;
      let temp = document.createElement("button");
      temp.textContent = "Temperature";
      let remove = document.createElement("button");
      remove.textContent = "Remove";
      div.appendChild(location);
      div.appendChild(temp);
      div.appendChild(remove);
      favoriteAreas.appendChild(div);
      temp.addEventListener("click", (e) => {
        fetchSelectedAreasWeather(area);
      });
      remove.addEventListener("click", (e) => {
        favoriteAreas.removeChild(div);
        selectedAreas.removeArea(area);
      });
    });
    refresh= true;
    showing = true;
    console.log(refresh, showing)
  }else{
    while(favoriteAreas.lastChild){
      favoriteAreas.removeChild(favoriteAreas.lastChild)
    }
    showing = false;
    refresh = false;
    console.log(refresh, showing)
  }
}

let showBtn = document.getElementById("show");
showBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (refresh && shown) {
    show(refresh, showing)
  }else{
    refresh = false;
    show(refresh, showing)}
  });

let subBtn = document.getElementById("submitBtn")

async function getWeather(location, unit) {
  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      location +
      "&units=" +
      unit +
      "&appid=" +
      API_KEY
  );
  return await response.json();
}

function extractWeatherData(data) {
  var weatherData = {
    location: data.name,
    temperature: data.main.temp,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    lastUpdated: new Date().toLocaleString(),
  };
  
  return weatherData;
}

function displayWeather(weatherData, unit) {
  var weatherContainer = document.getElementById("weatherContainer");
  weatherContainer.innerHTML = "";

  var locationElement = document.createElement("div");
  locationElement.className = "weather-info";
  locationElement.textContent = "Location: " + weatherData.location;
  weatherContainer.appendChild(locationElement);

  var tempElement = document.createElement("div");
  tempElement.className = "weather-info";
  tempElement.textContent =
    "Temperature: " + weatherData.temperature + "°" + unit;
  weatherContainer.appendChild(tempElement);

  var descElement = document.createElement("div");
  descElement.className = "weather-info";
  descElement.textContent = "Description: " + weatherData.description;
  weatherContainer.appendChild(descElement);

  var iconElement = document.createElement("img");
  iconElement.src =
    "https://openweathermap.org/img/w/" + weatherData.icon + ".png";
  iconElement.alt = weatherData.description;
  descElement.appendChild(iconElement);

  var lastUpdatedElement = document.createElement("div");
  lastUpdatedElement.className = "weather-info";
  lastUpdatedElement.textContent = "Last Updated: " + weatherData.lastUpdated;
  weatherContainer.appendChild(lastUpdatedElement);

}

function fetchSelectedAreasWeather(area) {
  var unit = document.querySelector('input[name="unit"]:checked').value;

  getWeather(area, unit)
    .then(function (weatherData) {
      var processedData = extractWeatherData(weatherData);
      displayWeather(processedData, unit);
    })
    .catch(function (error) {
      console.log("Error fetching weather for " + area + ": " + error.message);
    });
}

function displayLoading() {
  var weatherContainer = document.getElementById("weatherContainer");
  weatherContainer.innerHTML = "Loading...";
}

document
  .getElementById("locationForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    var location = document.getElementById("locationInput").value;
    var unit = document.querySelector('input[name="unit"]:checked').value;
     

    getWeather(location, unit)
      .then(function (weatherData) {
        var processedData = extractWeatherData(weatherData);
        displayWeather(processedData, unit);

        if (document.getElementById("savedAreaCheckbox").checked) {
          selectedAreas.addArea(location);
        }
      })
      .catch(function (error) {
        console.log(
          "Error fetching weather for " + location + ": " + error.message
        );
      });
  });
  subBtn.addEventListener("click", (e) => {
    
    console.log('submit', refresh, showing)
    if(showing == false)
    show(false, true)
    else if(showing)
    show(true, true)
 
})
//Figure out how to cover all scenarios with the submit button