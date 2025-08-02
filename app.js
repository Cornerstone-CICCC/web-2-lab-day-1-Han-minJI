const citynameInput = document.querySelector("#cityname");
const searchBtn = document.querySelector(".btn-search");
const cityNameTemp = document.querySelector(".city-temp");
const cityName = document.querySelector(".city-name");
const cityTemp = document.querySelector(".city-temp-info");
const country = document.querySelector(".country");
const timezone = document.querySelector(".timezone");
const population = document.querySelector(".population");
const tmrForecast = document.querySelector(".tmr-forecast");
const skyImg = document.querySelector(".sky-img");
const weatherTable = document.querySelector(".weather-table");
const cells = weatherTable.getElementsByTagName("td");
const head = weatherTable.getElementsByTagName("th");
const container = document.querySelector(".container");

searchBtn.addEventListener("click", async function () {
  const cityname = citynameInput.value;

  const cityData = await getCityData(cityname);
  const weatherData = await getWeatherData(cityname);
  console.log(weatherData);

  cityName.textContent = cityname;
  cityTemp.textContent = `${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}`;

  country.textContent = cityData.results[0].country;
  timezone.textContent = weatherData.timezone;
  population.textContent = cityData.results[0].population;

  tmrForecast.innerHTML = `Low: ${weatherData.daily.temperature_2m_min} ${weatherData.daily_units.temperature_2m_min} </br>
  Max: ${weatherData.daily.temperature_2m_max} ${weatherData.daily_units.temperature_2m_min}`;

  const body = document.body;

  const is_day = weatherData.current.is_day;

  if (is_day === 1) {
    body.style.backgroundColor = "black";
    skyImg.setAttribute("src", "./images/night.jpg");
    cityNameTemp.style.color = "white";

    container.classList.add("day");
  } else {
    container.classList.remove("day");
    skyImg.innerHTML = "<img src='./images/day.jpg' />";
  }
});

async function getCityData(city) {
  const resCity = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`,
  );

  const cityData = await resCity.json();
  return cityData;
}

async function getWeatherData(city) {
  const cityData = await getCityData(city);

  const lat = cityData.results[0].latitude;
  const lon = cityData.results[0].longitude;

  const resLatLon = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`,
  );

  const latLonData = await resLatLon.json();

  return latLonData;
}
