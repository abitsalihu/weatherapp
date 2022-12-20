"use strict";

console.log("Hello world");

// navigator.geolocation.getCurrentPosition(
//   function (position) {
//     // const coords = position;
//     // console.log(coords);
//     // console.log(position);
//     const [lat, lng] = [position.coords.latitude, position.coords.longitude];
//     console.log(lat, lng);
//   },
//   function () {
//     console.log(`could not get your location`);
//   }
// );

const getWeather = async function () {
  navigator.geolocation.getCurrentPosition(
    async function (pos) {
      const [lat, lon] = [pos.coords.latitude, pos.coords.longitude];

      const weather =
        await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=558f9e6b44092bec16ddae9ddb857fbe

`);
      const weatherJSON = await weather.json();
      console.log(weatherJSON);
    },
    function () {
      alert("Could not get your location");
    }
  );
};

getWeather();
