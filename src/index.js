import searchForCurrentWeather from "./api";

const display = (() => {
  const clouds = document.querySelector(".clouds");
  const location = document.querySelector(".location");
  const date = document.querySelector(".date");
  const temp = document.querySelector(".temp");
  const humidity = document.querySelector(".humidity");
  const feel = document.querySelector(".feel");
  const air = document.querySelector(".air");

  function updateAQI(aqi) {
    if (aqi === 1) return "Air Quality: 1 (Good)";
    if (aqi === 2) return "Air Quality: 2 (Fair)";
    if (aqi === 3) return "Air Quality: 3 (Moderate)";
    if (aqi === 4) return "Air Quality: 4 (Poor)";
    if (aqi === 5) return "Air Quality: 5 (Very Poor)";
    return "";
  }

  function update(weather) {
    if (weather.status === "fail") {
      clouds.textContent = "Invalid Search";
      location.textContent = "";
      date.textContent = "";
      temp.textContent = "";
      humidity.textContent = "";
      feel.textContent = "";
      air.textContent = "";
      return;
    }
    clouds.textContent = weather.clouds;
    location.textContent = weather.search;
    date.textContent = new Date().toDateString();
    temp.textContent = weather.temp;
    humidity.textContent = `Humidity: ${weather.humidity}%`;
    feel.textContent = `Feels like: ${weather.feel}`;
    air.textContent = updateAQI(weather.air);
  }

  return { update };
})();

function search() {
  let location = document.querySelector("#location").value;
  const units = "imperial";
  // Clean up input a bit
  while (true) {
    if (location.charAt(0) === " ") location = location.slice(1);
    else break;
  }
  location = location.replaceAll(" ", "-");

  searchForCurrentWeather(location, units).then((response) =>
    display.update(response)
  );
}

document.addEventListener("submit", (e) => {
  e.preventDefault();
  search();
});
