const API_KEY = '6ba521e04dcca23e89b903aa5087600d';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=' + API_KEY;

class SelectedAreas {
    constructor() {
    this.areas = JSON.parse(localStorage.getItem('selectedAreas')) || [];

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
        localStorage.setItem('selectedAreas', JSON.stringify(this.areas));
    };
    }
}

var selectedAreas = new SelectedAreas();

async function getWeather(location, unit) {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=' + unit + '&appid=' + API_KEY);
    return await response.json();
}

function extractWeatherData(data) {
    var weatherData = {
    location: data.name,
    temperature: data.main.temp,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    lastUpdated: new Date().toLocaleString() 
    };
    return weatherData;
}

function displayWeather(weatherData, unit) {
    var weatherContainer = document.getElementById('weatherContainer');
    weatherContainer.innerHTML = '';

    var locationElement = document.createElement('div');
    locationElement.className = 'weather-info';
    locationElement.textContent = 'Location: ' + weatherData.location;
    weatherContainer.appendChild(locationElement);

    var tempElement = document.createElement('div');
    tempElement.className = 'weather-info';
    tempElement.textContent = 'Temperature: ' + weatherData.temperature + '°' + unit;
    weatherContainer.appendChild(tempElement);

    var descElement = document.createElement('div');
    descElement.className = 'weather-info';
    descElement.textContent = 'Description: ' + weatherData.description;
    weatherContainer.appendChild(descElement);

    var iconElement = document.createElement('img');
    iconElement.src = 'https://openweathermap.org/img/w/' + weatherData.icon + '.png';
    iconElement.alt = weatherData.description;
    descElement.appendChild(iconElement);

    var lastUpdatedElement = document.createElement('div');
    lastUpdatedElement.className = 'weather-info';
    lastUpdatedElement.textContent = 'Last Updated: ' + weatherData.lastUpdated;
    weatherContainer.appendChild(lastUpdatedElement);
}

function fetchSelectedAreasWeather() {
    var unit = document.querySelector('input[name="unit"]:checked').value;

    for (var i = 0; i < selectedAreas.areas.length; i++) {
    var area = selectedAreas.areas[i];
    getWeather(area, unit)
        .then(function(weatherData) {
        var processedData = extractWeatherData(weatherData);
        displayWeather(processedData, unit);
        })
        .catch(function(error) {
        console.log('Error fetching weather for ' + area + ': ' + error.message);
        });
    }
}
function displayLoading() {
    var weatherContainer = document.getElementById('weatherContainer');
    weatherContainer.innerHTML = 'Loading...';
}

document.getElementById('locationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var location = document.getElementById('locationInput').value;
    var unit = document.querySelector('input[name="unit"]:checked').value;

    getWeather(location, unit)
    .then(function(weatherData) {
        var processedData = extractWeatherData(weatherData);
        displayWeather(processedData, unit);

        if (document.getElementById('savedAreaCheckbox').checked) {
        selectedAreas.addArea(location);
        }
    })
    .catch(function(error) {
        console.log('Error fetching weather for ' + location + ': ' + error.message);
    });
});