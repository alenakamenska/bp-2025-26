import React, { useEffect, useState } from "react";
import axios from "axios";
import "./warning.css";
import { GoAlert, GoCheckCircle} from "react-icons/go";
import Loading from "../Loading/Loading";

export default function Warning() {
  const [coords, setCoords] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const CACHE_KEY = "garden_weather_cache";
  const CACHE_MAX_AGE = 6 * 60 * 60 * 1000;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setCoords({ lat: 50.08, lon: 14.44 })
    );
  }, []);

  useEffect(() => {
    if (!coords) return;
    const loadWeather = async () => {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cache && Date.now() - cache.timestamp < CACHE_MAX_AGE) {
        generateAlerts(cache.data);
        setWeatherData(cache.data);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
          params: {
            latitude: coords.lat,
            longitude: coords.lon,
            daily: "weather_code,temperature_2m_max,temperature_2m_min",
            timezone: "auto",
          },
        });
        const data = response.data.daily;
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        setWeatherData(data);
        generateAlerts(data);
      } catch (err) {
        console.error("Chyba API:", err);
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  }, [coords]);

  const generateAlerts = (daily) => {
    if (!daily || !daily.weather_code || !daily.temperature_2m_min) {
      return; 
    }
    let newAlerts = [];
    [0, 1].forEach((i) => {
      if (daily.weather_code[i] === undefined) return;
      const dayLabel = i === 0 ? "DNES" : "ZÍTRA";
      const code = daily.weather_code[i];
      if ([95, 96, 99].includes(code)) {
        newAlerts.push({ type: "danger", msg: `${dayLabel}: Hrozí bouřky a krupobití!` });
      }
      if ([56, 57, 66, 67].includes(code)) {
        newAlerts.push({ type: "danger", msg: `${dayLabel}: Pozor na mrznoucí déšť!` });
      }
    });
    if (newAlerts.length === 0) {
      newAlerts.push({ type: "success", msg: "Nejsou hlášeny žádné nebezpečné meteorologické jevy" });
    }
    setAlerts(newAlerts);
  };

  if (loading) return <Loading />;

  return (
    <div className="garden-weather-card">
      <div className="weather-header">
        <h2 className="title"><GoAlert className="icon-alert" /> Výstrahy</h2>
      </div>
      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <div key={index} className={`alert-item ${alert.type}`}>
            {alert.type === "danger" ? <GoAlert /> : <GoCheckCircle />}
            <span>{alert.msg}</span>
          </div>
        ))}
      </div>
      <hr className="weather-divider" />
      <div className="weather-days-grid">
        {weatherData && [0, 1].map((i) => (
          <div key={i} className="day-forecast">
            <span className="day-name">{i === 0 ? "Dnes" : "Zítra"}</span>
            <div className="day-temps">
              <span className="temp-max">Denní maximum {Math.round(weatherData.temperature_2m_max[i])}°C</span>
              <span className="temp-min">Denní minimum {Math.round(weatherData.temperature_2m_min[i])}°C</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}