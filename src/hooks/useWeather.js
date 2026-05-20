import { useState, useEffect, useCallback } from "react";

const API_KEY = "7c4d9969b5fb468b547970288f2f7e17"; // Replace with your key
const BASE_URL = "https://api.openweathermap.org/data/2.5";
export default function useWeather() {
  const [city, setCity] = useState("London");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric"); // metric | imperial

  const fetchWeather = useCallback(
    async (searchCity) => {
      if (!searchCity?.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const [weatherRes, forecastRes] = await Promise.all([
          fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=${unit}`
          ),
          fetch(
            `${BASE_URL}/forecast?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=${unit}&cnt=40`
          ),
        ]);

        if (!weatherRes.ok) {
          if (weatherRes.status === 404) throw new Error("City not found. Try another name.");
          if (weatherRes.status === 401) throw new Error("Invalid API key. Please check your OpenWeatherMap key.");
          throw new Error("Failed to fetch weather data.");
        }

        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        setCurrent(weatherData);

        const daily = {};
        forecastData.list.forEach((item) => {
          const date = new Date(item.dt * 1000);
          const dayKey = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          if (!daily[dayKey]) daily[dayKey] = [];
          daily[dayKey].push(item);
        });

        const fiveDays = Object.entries(daily)
          .slice(0, 5)
          .map(([day, items]) => {
            const temps = items.map((i) => i.main.temp);
            const midItem = items[Math.floor(items.length / 2)];
            return {
              day,
              high: Math.round(Math.max(...temps)),
              low: Math.round(Math.min(...temps)),
              icon: midItem.weather[0].icon,
              desc: midItem.weather[0].main,
              humidity: midItem.main.humidity,
              wind: midItem.wind.speed,
            };
          });

        setForecast(fiveDays);
        setCity(weatherData.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [unit]
  );

  useEffect(() => {
    fetchWeather(city);
  }, [fetchWeather, city]);

  return { current, forecast, loading, error, unit, setUnit, fetchWeather, city };
}
