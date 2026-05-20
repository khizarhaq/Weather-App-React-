import { useState, useEffect } from "react";
import useWeather from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import StatPill from "./components/StatPill";
import ForecastCard from "./components/ForecastCard";
import LoadingPulse from "./components/LoadingPulse";
import ErrorCard from "./components/ErrorCard";
import { getWindDir, formatTime, weatherBg, WEATHER_EMOJI } from "./utils/weather";

const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

export default function WeatherApp() {
  const { current, forecast, loading, error, unit, setUnit, fetchWeather, city } = useWeather();
  const bg = current ? weatherBg(current.weather[0].id) : "clear";
  const symbol = unit === "metric" ? "°C" : "°F";
  const speedUnit = unit === "metric" ? "m/s" : "mph";
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 50);
    return () => clearTimeout(t);
  }, [current]);

  const handleSearch = (q) => {
    fetchWeather(q);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --clear:   linear-gradient(135deg, #1a3a6e 0%, #2c6fad 40%, #f7c948 100%);
          --cloud:   linear-gradient(135deg, #2d3561 0%, #6b7a99 50%, #b0bec5 100%);
          --rain:    linear-gradient(135deg, #1b2a4a 0%, #2e4d7b 50%, #4a7fa5 100%);
          --storm:   linear-gradient(135deg, #0d1b2a 0%, #1f3250 50%, #3d3d7a 100%);
          --snow:    linear-gradient(135deg, #2a3f6f 0%, #5b83b1 50%, #d0e8f7 100%);
          --fog:     linear-gradient(135deg, #3a3f5c 0%, #6e7a99 50%, #a8b0c8 100%);
          --accent:  #f7c948;
          --glass:   rgba(255,255,255,0.08);
          --glass-b: rgba(255,255,255,0.14);
          --text:    #ffffff;
          --muted:   rgba(255,255,255,0.55);
          --radius:  18px;
          --shadow:  0 24px 60px rgba(0,0,0,0.35);
        }

        body { font-family: 'DM Sans', sans-serif; }

        .app {
          min-height: 100vh;
          background: var(--clear);
          transition: background 1.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 16px 48px;
          position: relative;
          overflow-x: hidden;
        }
        .app.bg-clear  { background: var(--clear); }
        .app.bg-cloud  { background: var(--cloud); }
        .app.bg-rain   { background: var(--rain); }
        .app.bg-storm  { background: var(--storm); }
        .app.bg-snow   { background: var(--snow); }
        .app.bg-fog    { background: var(--fog); }

        .particle {
          position: fixed;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          pointer-events: none;
          animation: float linear infinite;
        }
        @keyframes float {
          0%   { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }

        .container {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.4rem, 4vw, 1.9rem);
          color: var(--text);
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-dot { color: var(--accent); }

        .unit-toggle {
          display: flex;
          background: var(--glass);
          border-radius: 50px;
          padding: 4px;
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
        }
        .unit-btn {
          background: none;
          border: none;
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          padding: 6px 14px;
          border-radius: 50px;
          transition: all 0.25s;
        }
        .unit-btn.active {
          background: var(--accent);
          color: #1a1a1a;
          font-weight: 700;
        }

        .search-form { width: 100%; }
        .search-wrapper {
          display: flex;
          align-items: center;
          background: var(--glass-b);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 50px;
          padding: 6px 6px 6px 18px;
          gap: 8px;
          box-shadow: var(--shadow);
          transition: border-color 0.2s;
        }
        .search-wrapper:focus-within {
          border-color: var(--accent);
        }
        .search-icon { color: var(--muted); display: flex; flex-shrink: 0; }
        .search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 400;
        }
        .search-input::placeholder { color: var(--muted); }
        .search-btn {
          background: var(--accent);
          color: #1a1a1a;
          border: none;
          border-radius: 50px;
          padding: 10px 22px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .search-btn:hover:not(:disabled) { opacity: 0.85; transform: scale(1.03); }
        .search-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { display: inline-block; animation: spin 0.8s linear infinite; }

        .main-card {
          background: var(--glass);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: var(--radius);
          padding: clamp(24px, 5vw, 44px);
          box-shadow: var(--shadow);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: start;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .main-card.visible { opacity: 1; transform: translateY(0); }

        .city-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          color: var(--text);
          letter-spacing: -1px;
          line-height: 1.1;
        }
        .country-tag {
          display: inline-block;
          background: var(--accent);
          color: #1a1a1a;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 50px;
          margin-left: 8px;
          vertical-align: middle;
          font-family: 'Syne', sans-serif;
        }
        .weather-desc {
          color: var(--muted);
          font-size: 1.05rem;
          font-weight: 300;
          font-style: italic;
          margin-top: 4px;
          text-transform: capitalize;
        }

        .temp-big {
          font-family: 'Syne', sans-serif;
          font-size: clamp(4rem, 12vw, 7rem);
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          letter-spacing: -4px;
          margin: 12px 0;
        }
        .feels-like { color: var(--muted); font-size: 0.9rem; margin-bottom: 16px; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
          margin-top: 8px;
        }
        .stat-pill {
          background: var(--glass);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.2s;
        }
        .stat-pill:hover { background: var(--glass-b); }
        .stat-icon { font-size: 1.4rem; flex-shrink: 0; }
        .stat-text { display: flex; flex-direction: column; min-width: 0; }
        .stat-label { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }
        .stat-value { font-size: 0.95rem; color: var(--text); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .weather-icon-big {
          width: clamp(90px, 18vw, 150px);
          height: clamp(90px, 18vw, 150px);
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.3));
          animation: bob 3s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }

        .sun-times {
          display: flex;
          gap: 16px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .sun-badge {
          background: var(--glass);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 0.85rem;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }
        .forecast-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        .forecast-card {
          background: var(--glass);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius);
          padding: 16px 10px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          opacity: 0;
          transform: translateY(16px);
          animation: slideUp 0.45s ease forwards;
          transition: background 0.2s, transform 0.2s;
          cursor: default;
        }
        .forecast-card:hover {
          background: var(--glass-b);
          transform: translateY(-4px) !important;
        }
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .fc-day { font-family: 'Syne', sans-serif; font-size: 0.78rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .fc-icon { width: 56px; height: 56px; margin: 4px auto; display: block; }
        .fc-desc { font-size: 0.78rem; color: var(--muted); margin-bottom: 6px; }
        .fc-temps { display: flex; justify-content: center; gap: 8px; margin-bottom: 6px; }
        .fc-high { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem; color: var(--text); }
        .fc-low  { font-size: 0.9rem; color: var(--muted); }
        .fc-meta { display: flex; flex-direction: column; gap: 2px; font-size: 0.72rem; color: var(--muted); }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 80px 0;
        }
        .loader-rings { position: relative; width: 80px; height: 80px; }
        .ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid transparent;
          animation: ringAnim 1.4s linear infinite;
        }
        .r1 { border-top-color: var(--accent); animation-duration: 1s; }
        .r2 { border-right-color: rgba(255,255,255,0.4); animation-duration: 1.4s; animation-direction: reverse; inset: 10px; }
        .r3 { border-bottom-color: rgba(255,255,255,0.2); animation-duration: 2s; inset: 20px; }
        @keyframes ringAnim { to { transform: rotate(360deg); } }
        .loading-text { color: var(--muted); font-size: 0.9rem; font-style: italic; }

        .error-card {
          background: rgba(220,50,50,0.15);
          border: 1px solid rgba(255,100,100,0.3);
          border-radius: var(--radius);
          padding: 32px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(12px);
        }
        .error-icon { font-size: 2.5rem; }
        .error-msg  { color: var(--text); font-size: 1rem; max-width: 320px; }
        .retry-btn  {
          background: rgba(255,255,255,0.15);
          color: var(--text);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 50px;
          padding: 8px 24px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          transition: background 0.2s;
        }
        .retry-btn:hover { background: rgba(255,255,255,0.25); }

        .api-notice {
          background: rgba(247,201,72,0.12);
          border: 1px solid rgba(247,201,72,0.35);
          border-radius: 12px;
          padding: 14px 18px;
          color: var(--accent);
          font-size: 0.85rem;
          text-align: center;
          backdrop-filter: blur(12px);
        }
        .api-notice a { color: var(--accent); font-weight: 600; }

        @media (max-width: 700px) {
          .main-card { grid-template-columns: 1fr; }
          .weather-icon-big { display: none; }
          .forecast-row { grid-template-columns: repeat(3, 1fr); }
          .forecast-row .forecast-card:nth-child(n+4) { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .forecast-row { grid-template-columns: repeat(2, 1fr); }
          .forecast-row .forecast-card:nth-child(n+3) { display: none; }
        }
      `}</style>

      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: `${Math.random() * 60 + 20}px`,
            height: `${Math.random() * 60 + 20}px`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 15}s`,
            animationDelay: `${Math.random() * 15}s`,
          }}
        />
      ))}

      <div className={`app bg-${bg}`}>
        <div className="container">
          <div className="header">
            <div className="logo">
              {WEATHER_EMOJI[bg] || "☀️"} Skye<span className="logo-dot">.</span>
            </div>
            <div className="unit-toggle">
              <button className={`unit-btn${unit === "metric" ? " active" : ""}`} onClick={() => setUnit("metric")}>°C</button>
              <button className={`unit-btn${unit === "imperial" ? " active" : ""}`} onClick={() => setUnit("imperial")}>°F</button>
            </div>
          </div>

          <SearchBar onSearch={handleSearch} loading={loading} />

          {/* {API_KEY === "YOUR_OPENWEATHERMAP_API_KEY" && (
            <div className="api-notice">
              🔑 Add your <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer">OpenWeatherMap API key</a> to the <code>API_KEY</code> constant at the top of this file to see live data.
            </div>
          )} */}

          {loading && <LoadingPulse />}
          {error && !loading && <ErrorCard message={error} onRetry={() => fetchWeather(city)} />}

          {current && !loading && !error && (
            <div className={`main-card${animate ? " visible" : ""}`}>
              <div>
                <div>
                  <span className="city-name">{current.name}</span>
                  <span className="country-tag">{current.sys.country}</span>
                </div>
                <p className="weather-desc">{current.weather[0].description}</p>

                <div className="temp-big">
                  {Math.round(current.main.temp)}{symbol}
                </div>
                <p className="feels-like">
                  Feels like {Math.round(current.main.feels_like)}{symbol} · High {Math.round(current.main.temp_max)}{symbol} · Low {Math.round(current.main.temp_min)}{symbol}
                </p>

                <div className="stats-grid">
                  <StatPill icon="💧" label="Humidity" value={`${current.main.humidity}%`} />
                  <StatPill icon="🌬️" label="Wind" value={`${current.wind.speed} ${speedUnit} ${getWindDir(current.wind.deg)}`} />
                  <StatPill icon="🔭" label="Visibility" value={`${(current.visibility / 1000).toFixed(1)} km`} />
                  <StatPill icon="📊" label="Pressure" value={`${current.main.pressure} hPa`} />
                  {current.clouds && <StatPill icon="☁️" label="Cloud Cover" value={`${current.clouds.all}%`} />}
                  {current.rain?.["1h"] != null && <StatPill icon="🌧️" label="Rain (1h)" value={`${current.rain["1h"]} mm`} />}
                </div>

                <div className="sun-times">
                  <div className="sun-badge">🌅 {formatTime(current.sys.sunrise)}</div>
                  <div className="sun-badge">🌇 {formatTime(current.sys.sunset)}</div>
                </div>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
                alt={current.weather[0].description}
                className="weather-icon-big"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {forecast.length > 0 && !loading && !error && (
            <div>
              <p className="section-title">5-Day Forecast</p>
              <div className="forecast-row">
                {forecast.map((day, i) => (
                  <ForecastCard key={day.day} {...day} unit={unit} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
