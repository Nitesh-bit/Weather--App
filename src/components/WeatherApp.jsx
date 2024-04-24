import React, { useEffect, useState } from "react";
import "./WeatherApp.css";

const apiKey = "b06003190241205a667e4b7b16af037a";
const apiURL = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

export default function WeatherApp() {
  const [cityName, setCityName] = useState("");
  const [error, setError] = useState(false);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (cityName === "") {
      setWeatherData(null);
      return;
    }

    async function getWeather(cityName) {
      const response = await fetch(apiURL + cityName + `&appid=${apiKey}`);

      if (response.status === 404) {
        setError(true);
      } else {
        const data = await response.json();
        setWeatherData(data);
        setError(false);
      }
    }

    const timer = setTimeout(() => {
      getWeather(cityName);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cityName]);

  const weatherImage = weatherData?.weather[0]?.main.toLowerCase();

  return (
    <div className="weather-card">
      <div className="input-container">
        <input
          type="text"
          placeholder="    Enter your cityname..."
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
      </div>
      {cityName && !error ? (
        <div className="weather-data">
          <img
            className="temp-img"
            src={
              !weatherData
                ? `images/sand-clock.png`
                : `images/${weatherImage}.png`
            }
            alt="temp-image"
          />
          {!weatherData ? (
            `Loading...`
          ) : (
            <h2>{Math.ceil(weatherData?.main?.temp)}°C</h2>
          )}
          <h3>{cityName}</h3>

          <div className="other-info">
            <div className="humidity-info">
              <img src="images/humidity.png" alt="humidity" />
              <p>Humidity {weatherData?.main?.humidity}%</p>
            </div>
            <div className="wind-info">
              <img src="images/wind.png" alt="wind" />
              <p>Wind-Speed {weatherData?.wind?.speed}Km/h</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="error-state">
          <p>There is some error in getting the data</p>
        </div>
      )}
    </div>
  );
}
