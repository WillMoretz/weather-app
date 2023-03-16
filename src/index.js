import searchForCurrentWeather from "./api";

searchForCurrentWeather("atlanta", "imperial").then((response) =>
  console.log(response)
);
