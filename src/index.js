async function getCoords(search) {
  try {
    const coords = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=a05425c7a86ef5f34e2684cd2b822c18`
    );
    const coordsData = await coords.json();
    return { lat: coordsData[0].lat, lon: coordsData[0].lon };
  } catch (error) {
    console.log(error);
    return "coords not found";
  }
}

async function getCurrentWeather(lat, lon, units) {
  try {
    const currentWeather = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a05425c7a86ef5f34e2684cd2b822c18&units=${units}`
    );
    const weatherData = await currentWeather.json();
    return {
      temp: weatherData.main.temp,
      feel: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      clouds: weatherData.weather[0].description,
      country: weatherData.sys.country,
    };
  } catch (error) {
    console.log(error);
    return "data not found";
  }
}

async function getCurrentAirQuality(lat, lon, units) {
  try {
    const currentAir = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=a05425c7a86ef5f34e2684cd2b822c18&units=${units}`
    );
    const airData = await currentAir.json();
    return { air: airData.list[0].main.aqi };
  } catch (error) {
    console.log(error);
    return "data not found";
  }
}

async function searchForCurrentWeather(search, units) {
  const weather = {};
  const coords = await getCoords(search);
  if (coords === "coords not found") {
    // Ask for better search
    return { status: "fail" };
  }

  const results = await Promise.all([
    getCurrentWeather(coords.lat, coords.lon, units),
    getCurrentAirQuality(coords.lat, coords.lon, units),
  ]);
  Object.assign(weather, results[0], results[1], { search, status: "success" });
  return weather;
}

searchForCurrentWeather("liberia", "imperial").then((response) =>
  console.log(response)
);
