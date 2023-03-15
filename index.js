// "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=a05425c7a86ef5f34e2684cd2b822c18"

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

const coords = getCoords("winston-salem");
coords.then((response) => {
  console.log(response);
});
