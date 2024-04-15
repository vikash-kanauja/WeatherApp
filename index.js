const searchInput = document.getElementById("search__input");
const searchButton = document.getElementById("search__btn");
const cityLocation = document.getElementById("location");
const weatherDescription = document.getElementById("description");
const locationError = document.querySelector(".location__error");
const weatherbox = document.getElementById("weather__box");
const temprature = document.getElementById("temp");
const loader = document.getElementById("loader");
const weatherImg = document.getElementById("weatherImg");
const errorMessage = document.getElementById("error");

// API key and base URL for OpenWeatherMap API
const API_KEY = "82005d27a116c2880c8f0fcb866998a0";
const baseUrl = "http://api.openweathermap.org/data/2.5/weather?";

const toggleElements = (loaderState, weatherBoxState, errorState) => {
  loader.classList.toggle("hidden", loaderState);
  weatherbox.classList.toggle("hidden", weatherBoxState);
  locationError.classList.toggle("hidden", errorState);
};

// Function to update the UI with weather details
const showWeatherDetails = (weatherinfo) => {
  searchInput.value = "";
  cityLocation.innerText = weatherinfo.name + " ," + weatherinfo.sys.country;
  weatherDescription.innerText = weatherinfo.weather[0].description;
  weatherImg.src = "./images/" + weatherinfo.weather[0].icon + ".png";
  temprature.innerText = (weatherinfo.main.temp - 273.15).toFixed(1) + "°";
  document.body.style.backgroundImage = `url(images/${weatherinfo.weather[0].main}.jpg)`;
  toggleElements(true,false, true);
};

const fetchDatafromCoordinates = (lat, lon) => {
    toggleElements(false, true, true);
  const url = `${baseUrl}lat=${lat}&lon=${lon}&appid=${API_KEY}`;
   fetch(url)
    .then((response) => response.json())
    .then((data) => {
      showWeatherDetails(data)
    })
    .catch(() => {
      toggleElements(true, true, false);
      errorMessage.innerText = "Oops city not found.";
    });
};

// Function to fetch weather details based on city name
const getCityCoordinates =  () => {
    const cityName =searchInput.value;
  if (!cityName) {
    console.log("return");
    return;
  }else{
      searchInput.value.trim();
console.log(cityName);
  const url = `${baseUrl}q=${cityName}&appid=${API_KEY}`;

  // Fetch weather data from the API
//   await 
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
      fetchDatafromCoordinates(data.coord.lat, data.coord.lon)
      toggleElements(false, true, true)
    })
    .catch(() => {
    //   showErrorMessage();
    errorMessage.innerText = "Oops city not found.";
      toggleElements(true, true, false);
      
    });
  }
};

// Function to fetch weather details based on user's current location
const getUserCoordinates = () => {
  toggleElements(true, true, true);
  navigator.geolocation.getCurrentPosition(
    // async
     (position) => {
      const { latitude, longitude } = position.coords;
      fetchDatafromCoordinates(latitude, longitude)
    },
    (error) => {
      toggleElements(true, true, false);
      errorMessage.innerText = "Location not available";
    }
  );
};

// Disable search button if input is empty
searchButton.disabled = true;
searchInput.addEventListener("change", () => {
  searchButton.disabled = searchInput.value === "";
});

// Fetch weather data based on user's current location
getUserCoordinates();

// Event listener for search button click
searchButton.addEventListener("click", getCityCoordinates);

// Execute a function when the user presses a key on the keyboard
searchInput.addEventListener("keypress", function (event) {

  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    event.preventDefault();
    getCityCoordinates()
  }else if(searchInput.value =="" && event.keyCode==32){
    event.preventDefault();
    return;
  }
});

