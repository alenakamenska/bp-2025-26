import { useEffect, useState } from "react";
import "./warning.css"
import { GoAlert } from "react-icons/go";

export default function GardenWeather() {
  const [coords, setCoords] = useState(null);
  const [tomorrowTemp, setTomorrowTemp] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(true);

  const CACHE_KEY = "weather_cache";
  const CACHE_MAX_AGE = 8 * 60 * 60 * 1000; 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      () => {
        setCoords({ lat: 50.08, lon: 14.44 }); 
      }
    );
  }, []);

  useEffect(() => {
    if (!coords) return;

    async function loadWeather() {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY));

      if (cache && Date.now() - cache.timestamp < CACHE_MAX_AGE) {
        setTomorrowTemp(cache.temp);
        generateRecommendations(cache.temp);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m`
      );
      const data = await res.json();

      const tomorrowTemp = getTomorrowTemperature(data);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          temp: tomorrowTemp,
          timestamp: Date.now(),
        })
      );

      setTomorrowTemp(tomorrowTemp);
      generateRecommendations(tomorrowTemp);
      setLoading(false);
    }

    loadWeather();
  }, [coords]);

  function getTomorrowTemperature(data) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");

    const target = `${yyyy}-${mm}-${dd}`;

    const idx = data.hourly.time.findIndex((t) => t.startsWith(target));
    return data.hourly.temperature_2m[idx]; 
  }

  function generateRecommendations(temp) {
    let msg = [];

    if (temp < 6) msg.push("Teplota pod 6°C - přikryjte rajčata!");
    if (temp < 3) msg.push("Pozor na mráz - dejte rostliny do tepla");
    if (temp > 28) msg.push("Bude horko - nevysazujte sazenice ven");

    if (msg.length === 0) msg.push("Vše v pořádku, žádná speciální opatření nejsou potřeba");

    setRecommendation(msg.join("\n"));
  }

  if (loading) return <p>Načítám...</p>;

  return (
    <div>
      <div className="warning">
        <h2 className="danger"><GoAlert />
        Výstrahy</h2>
        <h3>Zítřejší teplota: {tomorrowTemp}°C</h3>
        <pre>{recommendation}</pre>
      </div>
    </div>
  );
}
