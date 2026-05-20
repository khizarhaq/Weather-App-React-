export const getWindDir = (deg) => {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

export const formatTime = (unix) =>
  new Date(unix * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const weatherBg = (code) => {
  if (!code) return "clear";
  const c = String(code);
  if (c.startsWith("2")) return "storm";
  if (c.startsWith("3") || c.startsWith("5")) return "rain";
  if (c.startsWith("6")) return "snow";
  if (c.startsWith("7")) return "fog";
  if (c === "800") return "clear";
  if (c.startsWith("80")) return "cloud";
  return "clear";
};

export const WEATHER_EMOJI = {
  storm: "⛈️",
  rain: "🌧️",
  snow: "🌨️",
  fog: "🌫️",
  clear: "☀️",
  cloud: "⛅",
};
