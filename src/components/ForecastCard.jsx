export default function ForecastCard({ day, high, low, icon, desc, humidity, wind, unit, index }) {
  const symbol = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className="forecast-card" style={{ animationDelay: `${index * 0.08}s` }}>
      <p className="fc-day">{day}</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={desc}
        className="fc-icon"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
      <p className="fc-desc">{desc}</p>
      <div className="fc-temps">
        <span className="fc-high">{high}{symbol}</span>
        <span className="fc-low">{low}{symbol}</span>
      </div>
      <div className="fc-meta">
        <span>💧 {humidity}%</span>
        <span>💨 {wind}{windUnit}</span>
      </div>
    </div>
  );
}
