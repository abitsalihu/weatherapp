"use strict";

const body = document.querySelector("body");

const weatherCon = document.querySelector(".weather");
const weatherInfo = document.querySelector(".weather__cover");

const mooon = document.querySelector(".weather__moon");
const sun = document.querySelector(".weather__sun");

const loader = document.querySelector(".spinner");

const countryInfoCon = document.querySelector(".weather__country");
const countryInfoBtn = document.querySelector(".weather__country__btn");

let currentHour = new Date().getHours();

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

let time = `${weekdays[new Date().getDay()]} ${
  String(new Date().getHours()).length === 2
    ? new Date().getHours()
    : "0" + String(new Date().getHours())
}:${
  String(new Date().getMinutes()).length === 2
    ? new Date().getMinutes()
    : "0" + String(new Date().getMinutes())
}`;

if (currentHour >= 6 && currentHour < 16) {
  body.style.background = `#71BAFE`;
} else {
  body.style.background = `#222222`;
  body.style.background = `#263159`;
}

const createCloud = function (kind, cls) {
  const html = `
    <div class="cloud">
      <svg class="cloud__${cls}">
        <use xlink:href="img/sprite.svg#icon-${kind}"></use>
      </svg>
    </div>
  `;

  weatherInfo.insertAdjacentHTML("afterbegin", html);
};

const createWeather = function (fobj, sobj, time, icon) {
  const html = `
    <div class="weather__left">
        <div class="weather__left__icon">
          <svg class="weather__left__icon--fill">
            <use xlink:href="img/sprite.svg#icon-${icon}"></use>
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
          sobj.features[0].properties.city
        }, ${sobj.features[0].properties.country}</div>
        <div class="weather__right__date">${time}</div>
        <div class="weather__right__description">${fobj.weather[0].main}</div>
      </div>
  `;

  weatherInfo.insertAdjacentHTML("beforeend", html);
};

const createCountry = function (obj) {
  const html = `
   <div class="country">
      <div class="country__img">
        <img src="${obj[0].flags.png}" alt="" />
      </div>
      <div class="country__info">
        <div class="country__info--desc">Country: <span class="country__info--desc-returned">${
          obj[0].name
        } </span></div>
        <div class="country__info--desc">Capital City: <span class="country__info--desc-returned">${
          obj[0].capital
        }</span></div>
         <div class="country__info--desc">Region: <span class="country__info--desc-returned">${
           obj[0].region
         }</span></div>
        <div class="country__info--desc">Population: <span class="country__info--desc-returned">${obj[0].population.toLocaleString()}</span></div>
        <div class="country__info--desc">Currency: <span class="country__info--desc-returned">${
          obj[0].currencies[0].code
        }(${obj[0].currencies[0].symbol})</span></div>
        <div class="country__info--desc">Calling Code: <span class="country__info--desc-returned">+${
          obj[0].callingCodes[0]
        }</span></div>
        <div class="country__info--desc">Timezone: <span class="country__info--desc-returned">${
          obj[0].timezones[0]
        }</span></div>
      </div>
    </div>
  `;

  body.insertAdjacentHTML("beforeend", html);
};

let realCountry;
const getWeather = async function () {
  try {
    navigator.geolocation.getCurrentPosition(
      async function (pos) {
        const [lat, lon] = [pos.coords.latitude, pos.coords.longitude];

        const weather =
          await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=558f9e6b44092bec16ddae9ddb857fbe

        `);
        const weatherJSON = await weather.json();

        let weatherDesc = weatherJSON.weather[0].main;

        if (
          weatherDesc === "Clouds" ||
          weatherDesc === "Drizzle" ||
          weatherDesc === "Mist" ||
          weatherDesc === "Fog"
        ) {
          createCloud("cloud1", "sicon");
          createCloud("cloud1", "icon");
          weatherDesc = `cloud1`;
        } else if (weatherDesc === "Windy") {
          createCloud("windy", "sicon");
          createCloud("windy", "icon");
          weatherDesc = "windy";
        } else if (weatherDesc === "Snow") {
          createCloud("snowy", "sicon");
          createCloud("snowy", "icon");
          weatherDesc = "snowy";
        } else if (weatherDesc === "Rain") {
          createCloud("rainy", "sicon");
          createCloud("rainy", "icon");
          weatherDesc = "rainy";
        } else if (
          weatherDesc === "Clear" &&
          currentHour >= 6 &&
          currentHour < 16
        ) {
          createCloud("cloud1", "sicon");
          createCloud("cloud1", "icon");
          weatherDesc = "sun";
        } else {
          createCloud("cloud1", "sicon");
          createCloud("cloud1", "icon");
          weatherDesc = "cloud1";
        }

        const countryNameAPI = await fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=5211b93a8bc44403b82b75cff10ad799`
        );

        const country = await countryNameAPI.json();

        const realCountryAPI = await fetch(
          `https://restcountries.com/v2/name/${country.features[0].properties.country}`
        );

        realCountry = await realCountryAPI.json();

        if (currentHour >= 6 && currentHour < 16) {
          mooon.style.display = "none";
          if (weatherDesc === "sun") {
            sun.style.display = "inline-block";
          }
        } else {
          sun.style.display = "none";
          mooon.style.display = "inline-block";
        }

        loader.style.display = "none";
        weatherCon.style.display = "flex";
        weatherCon.style.opacity = "1";

        countryInfoBtn.innerHTML = country.features[0].properties.country;

        createWeather(weatherJSON, country, time, weatherDesc);

        return realCountry;
      },

      function () {
        alert(
          "Please allow the app to see your location so it can show the data. :)"
        );
      }
    );
  } catch (err) {
    console.log(`Error happened --- ${err.message}`);
  }
};

getWeather();

countryInfoBtn.addEventListener("click", () => {
  createCountry(realCountry);
  countryInfoCon.style.animation = `removeObj 1s ease forwards`;
  weatherInfo.style.animation = `removeMargin 1s ease forwards`;
});
