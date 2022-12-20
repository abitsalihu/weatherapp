"use strict";

console.log("Hello world");

const weatherCon = document.querySelector(".weather");

const currentHour = new Date().getHours();
console.log(currentHour);
const createWeather = function (obj, snrs, sns) {
  const html = `
    <div class="weather__icon">
        <img src="http://openweathermap.org/img/w/${
          obj.weather[0].icon
        }.png" alt="" />
    </div>
    <div class="weather__city">${obj.name}</div>
    <div class="weather__temp">
    <div class="weather__temp-box">
        <span class="weather__temp-box--title">Current Temp:</span>${Math.round(
          obj.main.temp - 273.15
        )}<span
        >&#8451;</span
        >
    </div>
        <div class="weather__temp-box">
        <span class="weather__temp-box--title">Max Temp:</span>${Math.round(
          obj.main.temp_max - 273.15
        )}<span
        >&#8451;</span
        >
    </div>
    <div class="weather__temp-box">
        <span class="weather__temp-box--title">Min Temp:</span>${Math.round(
          obj.main.temp_min - 273.15
        )}<span
        >&#8451;</span
        >
    </div>

    <div class="weather__temp-box">
        <span class="weather__temp-box--title">Sunrise:</span><span class="weather__temp-box--sun">${snrs}</span>
    </div>
    <div class="weather__temp-box">
        <span class="weather__temp-box--title">Sunset:</span><span class="weather__temp-box--sun">${sns}</span>
    </div>
    </div> 
  `;

  weatherCon.insertAdjacentHTML("beforeend", html);
};
const getWeather = async function () {
  navigator.geolocation.getCurrentPosition(
    async function (pos) {
      const [lat, lon] = [pos.coords.latitude, pos.coords.longitude];

      const weather =
        await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=558f9e6b44092bec16ddae9ddb857fbe

`);
      const weatherJSON = await weather.json();

      console.log(weatherJSON);

      let [unixSunrise, unixSunset] = [
        weatherJSON.sys.sunrise,
        weatherJSON.sys.sunset,
      ];

      let sunriseDate = new Date(unixSunrise * 1000);
      let sunsetDate = new Date(unixSunset * 1000);

      console.log(sunriseDate, sunsetDate);

      console.log(String(sunriseDate.getSeconds()).length);

      const check =
        String(sunriseDate.getSeconds()).length === 2
          ? sunriseDate.getSeconds()
          : "0" + sunriseDate.getSeconds();

      console.log(check);

      const sunrise = `${
        String(sunriseDate.getDate()).length === 2
          ? sunriseDate.getDate()
          : "0" + sunriseDate.getDate()
      }/${sunriseDate.getFullYear()} - ${
        String(sunriseDate.getHours()).length === 2
          ? sunriseDate.getHours()
          : "0" + sunriseDate.getHours()
      }:${
        String(sunriseDate.getMinutes()).length === 2
          ? sunriseDate.getMinutes()
          : "0" + sunriseDate.getMinutes()
      }:${
        String(sunriseDate.getSeconds()).length === 2
          ? sunriseDate.getSeconds()
          : "0" + sunriseDate.getSeconds()
      }`;

      const sunset = `${
        String(sunsetDate.getDate()).length === 2
          ? sunsetDate.getDate()
          : "0" + sunsetDate.getDate()
      }/${sunsetDate.getFullYear()} - ${
        String(sunsetDate.getHours()).length === 2
          ? sunsetDate.getHours()
          : "0" + sunsetDate.getHours()
      }:${
        String(sunsetDate.getMinutes()).length === 2
          ? sunsetDate.getMinutes()
          : "0" + sunsetDate.getMinutes()
      }:${
        String(sunsetDate.getSeconds()).length === 2
          ? sunsetDate.getSeconds()
          : "0" + sunsetDate.getSeconds()
      }`;

      console.log(sunrise, sunset);

      createWeather(weatherJSON, sunrise, sunset);

      weatherCon.style.opacity = "1";
    },
    function () {
      alert("Could not get your location");
    }
  );
};

getWeather();
