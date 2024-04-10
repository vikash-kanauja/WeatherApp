// Selecting DOM elements
const searchInput = document.getElementById("search__input");
const searchButton = document.getElementById("search__btn");
const cityLocation = document.getElementById("location");
const humidity = document.getElementById("humidity");
const weatherDescription = document.getElementById("description");
const locationError = document.querySelector(".location__error");
const weatherbox = document.getElementById("weather__box");
const temprature = document.getElementById("temp");
const wind = document.getElementById("wind");
const loader = document.getElementById("loader");
const weatherImg = document.getElementById("weatherImg");
const errorMessage = document.getElementById("error");


// API key and base URL for OpenWeatherMap API
const API_KEY = "82005d27a116c2880c8f0fcb866998a0";
const baseUrl = "http://api.openweathermap.org/data/2.5/weather?";

// Function to update the UI with weather details
const getWeatherDetails = (weatherinfo) => {
  
  
  loader.classList.add("hidden");
  weatherbox.classList.remove("hidden");
  locationError.classList.add("hidden");
  searchInput.value = "";
  cityLocation.innerText = weatherinfo.name;
  wind.innerText = weatherinfo.wind.speed + " km/h";
  humidity.innerText = weatherinfo.main.humidity;
  weatherDescription.innerText = weatherinfo.weather[0].description;
  weatherImg.src = "./images/" + weatherinfo.weather[0].icon + ".png";
  temprature.innerText = (weatherinfo.main.temp - 273.15).toFixed(1) + " °C";
  document.body.style.backgroundImage =`url(images/${weatherinfo.weather[0].main}.jpg)`

};

// Function to fetch weather details based on city name
const getCityCoordinates = async () => {
  const cityName = searchInput.value.trim();
  loader.classList.remove("hidden");
  weatherbox.classList.add("hidden");
  locationError.classList.add("hidden");

  if (cityName === "") {
    loader.classList.add("hidden");
    weatherbox.classList.add("hidden");
    locationError.classList.add("hidden");
    return;
  }

  const url = `${baseUrl}q=${cityName}&appid=${API_KEY}`;
  
  // Fetch weather data from the API
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      getWeatherDetails(data);
    })
    .catch(() => {
      loader.classList.add("hidden");
      weatherbox.classList.add("hidden");
      locationError.classList.remove("hidden");
      errorMessage.innerText = "Oops city not found.";
    });
};

// Function to fetch weather details based on user's current location
const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      loader.classList.remove("hidden");
      weatherbox.classList.add("hidden");
      locationError.classList.add("hidden");

      const url = `${baseUrl}lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
      
      // Fetch weather data from the API
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          getWeatherDetails(data);
        })
        .catch(() => {
          weatherbox.classList.add("hidden");
          locationError.classList.add("hidden");
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        weatherbox.classList.add("hidden");
        locationError.classList.remove("hidden");
        loader.classList.add("hidden");
        errorMessage.innerText = "Location not available";
      } else {
        weatherbox.classList.add("hidden");
        locationError.classList.add("hidden");
      }
    }
  );
};

// Disable search button if input is empty
searchButton.disabled = true;
searchInput.addEventListener("change", () => {
  if (searchInput.value === "") {
    searchButton.disabled = true;
  } else {
    searchButton.disabled = false;
  }
});

// Fetch weather data based on user's current location
getUserCoordinates();

// Event listener for search button click
searchButton.addEventListener("click", getCityCoordinates);
