"use strict";

const weatherCon = document.querySelector(".weather");
const weatherInfo = document.querySelector(".weather__cover");

const body = document.querySelector("body");

const mooon = document.querySelector(".weather__moon");

const loader = document.querySelector(".spinner");

let currentHour = new Date().getHours();

// currentHour = 16;

console.log(currentHour);

// currentHour = 8;

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  ,
];

let time = `${
  weekdays[new Date().getDay()]
} ${new Date().getHours()}:${new Date().getMinutes()}`;

console.log(time);

if (currentHour >= 6 && currentHour < 16) {
  body.style.background = `#71BAFE`;
} else {
  body.style.background = `#222222`;
}

console.log(currentHour);
const createWeather = function (fobj, sobj, time) {
  const html = `
    <div class="weather__left">
        <div class="weather__left__icon">
          <svg class="weather__left__icon--fill">
            <use xlink:href="/sprite.svg#icon-cloud1"></use>
          </svg>
        </div>
        <div class="weather__left__degree">${Math.round(
          fobj.main.temp - 273.15
        )}<span class="weather__left__degree-cicon">&#8451</span>  
        </div>
        <div class="weather__left__line"></div>
        <div class="weather__left__phwinfo">
          <div class="weather__left__phwinfo--box">Cloudiness: <span>${
            fobj.clouds.all
          }</span>%</div>
          <div class="weather__left__phwinfo--box">Humidity: <span>${
            fobj.main.humidity
          }</span>%</div>
          <div class="weather__left__phwinfo--box">Wind: <span>${String(
            (fobj.wind.speed * 3600) / 1000
          ).slice(0, 3)}</span>km/h</div>
        </div>
      </div>
      <div class="weather__right">
        <div class="weather__right__name">${
          sobj.addresses[0].address.localName
        }, ${sobj.addresses[0].address.country}</div>
        <div class="weather__right__date">${time}</div>
        <div class="weather__right__description">${fobj.weather[0].main}</div>
      </div>
  `;

  weatherInfo.insertAdjacentHTML("beforeend", html);
};

const getWeather = async function () {
  try {
    navigator.geolocation.getCurrentPosition(
      async function (pos) {
        const [lat, lon] = [pos.coords.latitude, pos.coords.longitude];

        const weather =
          await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=558f9e6b44092bec16ddae9ddb857fbe

        `);
        const weatherJSON = await weather.json();

        console.log(weatherJSON);

        // let [unixSunrise, unixSunset] = [
        //   weatherJSON.sys.sunrise,
        //   weatherJSON.sys.sunset,
        // ];

        // let sunriseDate = new Date(unixSunrise * 1000);
        // let sunsetDate = new Date(unixSunset * 1000);

        // getAddress(lat, lon);

        const locationAPI = await fetch(
          `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lon}.json?key=bGDpK4GFAJsRIaBIjq5dqo4KjN7eJEPw&radius=100
`
        );

        const location = await locationAPI.json();
        console.log(location);

        console.log(location.addresses[0].address.freeformAddress);

        if (currentHour >= 6 && currentHour < 16) {
          mooon.style.display = "none";
        } else {
          mooon.style.display = "inline-block";
        }

        loader.style.display = "none";
        weatherCon.style.display = "flex";
        weatherCon.style.opacity = "1";

        createWeather(weatherJSON, location, time);
      },

      function () {
        alert("Could not get your location");
      }
    );
  } catch (err) {
    console.log(`Error happened --- ${err.message}`);
  }
};

getWeather();
