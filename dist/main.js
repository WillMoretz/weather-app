/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
async function getCoords(search) {
  try {
    const coords = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=a05425c7a86ef5f34e2684cd2b822c18`
    );
    const coordsData = await coords.json();
    return { lat: coordsData[0].lat, lon: coordsData[0].lon };
  } catch (error) {
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (searchForCurrentWeather);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ "./src/api.js");


const tempUnits = (() => {
  let currentUnit = "F";

  function toggle() {
    currentUnit === "F" ? (currentUnit = "C") : (currentUnit = "F");
  }
  function getUnit() {
    return currentUnit;
  }

  return { toggle, getUnit };
})();

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
    temp.textContent = `${Math.round(weather.temp)} °${tempUnits.getUnit()}`;
    humidity.textContent = `Humidity: ${weather.humidity}%`;
    feel.textContent = `Feels like: ${Math.round(
      weather.feel
    )} °${tempUnits.getUnit()}`;
    air.textContent = updateAQI(weather.air);
  }

  return { update };
})();

function search() {
  let location = document.querySelector("#location").value;
  const units = tempUnits.getUnit() === "F" ? "imperial" : "metric";
  // Clean up input a bit
  while (true) {
    if (location.charAt(0) === " ") location = location.slice(1);
    else break;
  }
  location = location.replaceAll(" ", "-");

  (0,_api__WEBPACK_IMPORTED_MODULE_0__["default"])(location, units).then((response) =>
    display.update(response)
  );
}

document.addEventListener("submit", (e) => {
  e.preventDefault();
  search();
});

document.querySelector(".temp-toggle").addEventListener("click", () => {
  tempUnits.toggle();
  document.querySelector(
    ".active-temp"
  ).textContent = `°${tempUnits.getUnit()}`;
  search();
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBLHdEQUF3RCxPQUFPO0FBQy9EO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2REFBNkQsSUFBSSxPQUFPLElBQUksZ0RBQWdELE1BQU07QUFDbEk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0UsSUFBSSxPQUFPLElBQUksZ0RBQWdELE1BQU07QUFDdkk7QUFDQTtBQUNBLGFBQWE7QUFDYixJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsMkJBQTJCO0FBQzlFO0FBQ0E7O0FBRUEsaUVBQWUsdUJBQXVCLEVBQUM7Ozs7Ozs7VUMxRHZDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNONEM7O0FBRTVDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWCxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLDBCQUEwQixHQUFHLG9CQUFvQjtBQUMzRSx3Q0FBd0MsaUJBQWlCO0FBQ3pELHNDQUFzQztBQUN0QztBQUNBLE9BQU8sR0FBRyxvQkFBb0I7QUFDOUI7QUFDQTs7QUFFQSxXQUFXO0FBQ1gsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBRSxnREFBdUI7QUFDekI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isb0JBQW9CO0FBQzFDO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2FwaS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImFzeW5jIGZ1bmN0aW9uIGdldENvb3JkcyhzZWFyY2gpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjb29yZHMgPSBhd2FpdCBmZXRjaChcbiAgICAgIGBodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL2RpcmVjdD9xPSR7c2VhcmNofSZsaW1pdD01JmFwcGlkPWEwNTQyNWM3YTg2ZWY1ZjM0ZTI2ODRjZDJiODIyYzE4YFxuICAgICk7XG4gICAgY29uc3QgY29vcmRzRGF0YSA9IGF3YWl0IGNvb3Jkcy5qc29uKCk7XG4gICAgcmV0dXJuIHsgbGF0OiBjb29yZHNEYXRhWzBdLmxhdCwgbG9uOiBjb29yZHNEYXRhWzBdLmxvbiB9O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBcImNvb3JkcyBub3QgZm91bmRcIjtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDdXJyZW50V2VhdGhlcihsYXQsIGxvbiwgdW5pdHMpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjdXJyZW50V2VhdGhlciA9IGF3YWl0IGZldGNoKFxuICAgICAgYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZhcHBpZD1hMDU0MjVjN2E4NmVmNWYzNGUyNjg0Y2QyYjgyMmMxOCZ1bml0cz0ke3VuaXRzfWBcbiAgICApO1xuICAgIGNvbnN0IHdlYXRoZXJEYXRhID0gYXdhaXQgY3VycmVudFdlYXRoZXIuanNvbigpO1xuICAgIHJldHVybiB7XG4gICAgICB0ZW1wOiB3ZWF0aGVyRGF0YS5tYWluLnRlbXAsXG4gICAgICBmZWVsOiB3ZWF0aGVyRGF0YS5tYWluLmZlZWxzX2xpa2UsXG4gICAgICBodW1pZGl0eTogd2VhdGhlckRhdGEubWFpbi5odW1pZGl0eSxcbiAgICAgIGNsb3Vkczogd2VhdGhlckRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbixcbiAgICAgIGNvdW50cnk6IHdlYXRoZXJEYXRhLnN5cy5jb3VudHJ5LFxuICAgIH07XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIFwiZGF0YSBub3QgZm91bmRcIjtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDdXJyZW50QWlyUXVhbGl0eShsYXQsIGxvbiwgdW5pdHMpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBjdXJyZW50QWlyID0gYXdhaXQgZmV0Y2goXG4gICAgICBgaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvYWlyX3BvbGx1dGlvbj9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mYXBwaWQ9YTA1NDI1YzdhODZlZjVmMzRlMjY4NGNkMmI4MjJjMTgmdW5pdHM9JHt1bml0c31gXG4gICAgKTtcbiAgICBjb25zdCBhaXJEYXRhID0gYXdhaXQgY3VycmVudEFpci5qc29uKCk7XG4gICAgcmV0dXJuIHsgYWlyOiBhaXJEYXRhLmxpc3RbMF0ubWFpbi5hcWkgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gXCJkYXRhIG5vdCBmb3VuZFwiO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNlYXJjaEZvckN1cnJlbnRXZWF0aGVyKHNlYXJjaCwgdW5pdHMpIHtcbiAgY29uc3Qgd2VhdGhlciA9IHt9O1xuICBjb25zdCBjb29yZHMgPSBhd2FpdCBnZXRDb29yZHMoc2VhcmNoKTtcbiAgaWYgKGNvb3JkcyA9PT0gXCJjb29yZHMgbm90IGZvdW5kXCIpIHtcbiAgICAvLyBBc2sgZm9yIGJldHRlciBzZWFyY2hcbiAgICByZXR1cm4geyBzdGF0dXM6IFwiZmFpbFwiIH07XG4gIH1cblxuICBjb25zdCByZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgIGdldEN1cnJlbnRXZWF0aGVyKGNvb3Jkcy5sYXQsIGNvb3Jkcy5sb24sIHVuaXRzKSxcbiAgICBnZXRDdXJyZW50QWlyUXVhbGl0eShjb29yZHMubGF0LCBjb29yZHMubG9uLCB1bml0cyksXG4gIF0pO1xuICBPYmplY3QuYXNzaWduKHdlYXRoZXIsIHJlc3VsdHNbMF0sIHJlc3VsdHNbMV0sIHsgc2VhcmNoLCBzdGF0dXM6IFwic3VjY2Vzc1wiIH0pO1xuICByZXR1cm4gd2VhdGhlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2VhcmNoRm9yQ3VycmVudFdlYXRoZXI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBzZWFyY2hGb3JDdXJyZW50V2VhdGhlciBmcm9tIFwiLi9hcGlcIjtcblxuY29uc3QgdGVtcFVuaXRzID0gKCgpID0+IHtcbiAgbGV0IGN1cnJlbnRVbml0ID0gXCJGXCI7XG5cbiAgZnVuY3Rpb24gdG9nZ2xlKCkge1xuICAgIGN1cnJlbnRVbml0ID09PSBcIkZcIiA/IChjdXJyZW50VW5pdCA9IFwiQ1wiKSA6IChjdXJyZW50VW5pdCA9IFwiRlwiKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRVbml0KCkge1xuICAgIHJldHVybiBjdXJyZW50VW5pdDtcbiAgfVxuXG4gIHJldHVybiB7IHRvZ2dsZSwgZ2V0VW5pdCB9O1xufSkoKTtcblxuY29uc3QgZGlzcGxheSA9ICgoKSA9PiB7XG4gIGNvbnN0IGNsb3VkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xvdWRzXCIpO1xuICBjb25zdCBsb2NhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9jYXRpb25cIik7XG4gIGNvbnN0IGRhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRhdGVcIik7XG4gIGNvbnN0IHRlbXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRlbXBcIik7XG4gIGNvbnN0IGh1bWlkaXR5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5odW1pZGl0eVwiKTtcbiAgY29uc3QgZmVlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmVlbFwiKTtcbiAgY29uc3QgYWlyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5haXJcIik7XG5cbiAgZnVuY3Rpb24gdXBkYXRlQVFJKGFxaSkge1xuICAgIGlmIChhcWkgPT09IDEpIHJldHVybiBcIkFpciBRdWFsaXR5OiAxIChHb29kKVwiO1xuICAgIGlmIChhcWkgPT09IDIpIHJldHVybiBcIkFpciBRdWFsaXR5OiAyIChGYWlyKVwiO1xuICAgIGlmIChhcWkgPT09IDMpIHJldHVybiBcIkFpciBRdWFsaXR5OiAzIChNb2RlcmF0ZSlcIjtcbiAgICBpZiAoYXFpID09PSA0KSByZXR1cm4gXCJBaXIgUXVhbGl0eTogNCAoUG9vcilcIjtcbiAgICBpZiAoYXFpID09PSA1KSByZXR1cm4gXCJBaXIgUXVhbGl0eTogNSAoVmVyeSBQb29yKVwiO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKHdlYXRoZXIpIHtcbiAgICBpZiAod2VhdGhlci5zdGF0dXMgPT09IFwiZmFpbFwiKSB7XG4gICAgICBjbG91ZHMudGV4dENvbnRlbnQgPSBcIkludmFsaWQgU2VhcmNoXCI7XG4gICAgICBsb2NhdGlvbi50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICBkYXRlLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgIHRlbXAudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgZmVlbC50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICBhaXIudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjbG91ZHMudGV4dENvbnRlbnQgPSB3ZWF0aGVyLmNsb3VkcztcbiAgICBsb2NhdGlvbi50ZXh0Q29udGVudCA9IHdlYXRoZXIuc2VhcmNoO1xuICAgIGRhdGUudGV4dENvbnRlbnQgPSBuZXcgRGF0ZSgpLnRvRGF0ZVN0cmluZygpO1xuICAgIHRlbXAudGV4dENvbnRlbnQgPSBgJHtNYXRoLnJvdW5kKHdlYXRoZXIudGVtcCl9IMKwJHt0ZW1wVW5pdHMuZ2V0VW5pdCgpfWA7XG4gICAgaHVtaWRpdHkudGV4dENvbnRlbnQgPSBgSHVtaWRpdHk6ICR7d2VhdGhlci5odW1pZGl0eX0lYDtcbiAgICBmZWVsLnRleHRDb250ZW50ID0gYEZlZWxzIGxpa2U6ICR7TWF0aC5yb3VuZChcbiAgICAgIHdlYXRoZXIuZmVlbFxuICAgICl9IMKwJHt0ZW1wVW5pdHMuZ2V0VW5pdCgpfWA7XG4gICAgYWlyLnRleHRDb250ZW50ID0gdXBkYXRlQVFJKHdlYXRoZXIuYWlyKTtcbiAgfVxuXG4gIHJldHVybiB7IHVwZGF0ZSB9O1xufSkoKTtcblxuZnVuY3Rpb24gc2VhcmNoKCkge1xuICBsZXQgbG9jYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2xvY2F0aW9uXCIpLnZhbHVlO1xuICBjb25zdCB1bml0cyA9IHRlbXBVbml0cy5nZXRVbml0KCkgPT09IFwiRlwiID8gXCJpbXBlcmlhbFwiIDogXCJtZXRyaWNcIjtcbiAgLy8gQ2xlYW4gdXAgaW5wdXQgYSBiaXRcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBpZiAobG9jYXRpb24uY2hhckF0KDApID09PSBcIiBcIikgbG9jYXRpb24gPSBsb2NhdGlvbi5zbGljZSgxKTtcbiAgICBlbHNlIGJyZWFrO1xuICB9XG4gIGxvY2F0aW9uID0gbG9jYXRpb24ucmVwbGFjZUFsbChcIiBcIiwgXCItXCIpO1xuXG4gIHNlYXJjaEZvckN1cnJlbnRXZWF0aGVyKGxvY2F0aW9uLCB1bml0cykudGhlbigocmVzcG9uc2UpID0+XG4gICAgZGlzcGxheS51cGRhdGUocmVzcG9uc2UpXG4gICk7XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBzZWFyY2goKTtcbn0pO1xuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRlbXAtdG9nZ2xlXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gIHRlbXBVbml0cy50b2dnbGUoKTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBcIi5hY3RpdmUtdGVtcFwiXG4gICkudGV4dENvbnRlbnQgPSBgwrAke3RlbXBVbml0cy5nZXRVbml0KCl9YDtcbiAgc2VhcmNoKCk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==