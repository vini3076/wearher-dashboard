//Third party API to get the weather of a city

let rootUrl = "https://api.openweathermap.org";
let apiKey = "3b15d389d9ea2f623097685ff81ba875";

function searchCity(city) {
  //fetch for the API
  fetch(`${rootUrl}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
  

      // latitude and longitude to be used in weather API
      let lat = data[0].lat;
      let lon = data[0].lon;
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);

      let weather = `${rootUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      fetch(weather)
        .then(function (response) {
          return response.json();
        })
        .then(function (weatherData) {
          displayWeather(weatherData);
        });
    });
}

function displayWeather(data) {
  let currentDate = data.current.dt;
  let formattedDate = dayjs.unix(currentDate).format("dddd MMMM DD, YYYY");
  let currentIcon = data.current.weather[0].icon;
  let currentIconImage =
    "http://openweathermap.org/img/w/" + currentIcon + ".png";
  let currentTemp = (((data.current.temp - 273.15) * 9) / 5 + 32).toFixed(0);
  let currentHumidity = data.current.humidity;
  let currentWind = Math.floor(data.current.wind_speed);

  document.getElementById("today").textContent = formattedDate;
  document.getElementById("current-temp").textContent =
    "Temp: " + currentTemp + " °F";
  document.getElementById("current-wind").textContent =
    "Wind: " + currentWind + " MPH";
  document.getElementById("current-humidity").textContent =
    "Humidity: " + currentHumidity + "%";
  document.getElementById("icon").style.display = "inline";
  document.getElementById("icon").setAttribute("src", currentIconImage);

  //displaying five day forecast
  let fiveDay = document.getElementById("five-day-forecast");
  fiveDay.innerHTML = "";

  let fiveDayCards = "";

  for (i = 0; i < 5; i++) {
    let forecastDate = data.daily[i].dt;
    let formattedForecastDt = dayjs
      .unix(forecastDate)
      .format("dddd MMMM DD, YYYY");
    let dayTempMax = (((data.daily[i].temp.max - 273.15) * 9) / 5 + 32).toFixed(
      0
    );
    let dayTempMin = (((data.daily[i].temp.min - 273.15) * 9) / 5 + 32).toFixed(
      0
    );
    let dayIcon = data.daily[i].weather[0].icon;
    let dayIconImage = "http://openweathermap.org/img/w/" + dayIcon + ".png";
    let dayWind = data.daily[i].wind_speed;
    let dayHumidity = data.daily[i].humidity;

    fiveDayCards = `
            <div class="col-md-2">
            <div class="card">
          <div class="card-body">
                <p>${formattedForecastDt}</p>
                <img src='${dayIconImage}'>
                <p>High: ${dayTempMax} °F</p>
                <p>Low: ${dayTempMin} °F</p>
                <p>Wind: ${dayWind} MPH</p>
                <p>Humidity: ${dayHumidity}%</p>
            </div>
            </div>
            </div>
            `;
    fiveDay.insertAdjacentHTML("beforeend", fiveDayCards);
  }
}

function addButtons() {
  // Get existing cities from local storage
  let previousCities =
    JSON.parse(localStorage.getItem("previous-cities")) || [];

  let previousSearches = document.getElementById("previous-searches");
  previousSearches.innerHTML = "";

  // Add button for each city
  for (let i = 0; i < previousCities.length; i++) {
    previousSearches.insertAdjacentHTML(
      "beforeend",
      `
        <li><button class="previous-search btn btn-dark ms-4"'>${previousCities[i]}</button></li>
        `
    );
  }

  // Add event listener to each button
  let previousSearchButtons = document.querySelectorAll(".previous-search");
  previousSearchButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      let city = this.textContent;
      searchCity(city);
      document.getElementById("city").textContent = city + " ";
    });
  });
}

function saveSearch(cityName) {
  // Get existing cities from local storage
  let previousCities =
    JSON.parse(localStorage.getItem("previous-cities")) || [];

  // Limiting search to 8 cities
  if (previousCities.length == 8) {
    previousCities.shift();
  }

  // Add the new city to the array
  previousCities.push(cityName);

  // Save the updated cities back to local storage
  localStorage.setItem("previous-cities", JSON.stringify(previousCities));

  // Add the buttons for the cities
  addButtons();
}

//Add buttons for previous searches
addButtons();

document.getElementById("search").addEventListener("click", function () {
  console.log("click");

  //making sure User enters city
  let city = document.getElementById("input-box").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  document.getElementById("city").textContent = city + " ";
  console.log(city);

  saveSearch(city);
  searchCity(city);
});
