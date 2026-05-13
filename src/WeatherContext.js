import { useState, useEffect } from "react";

function useWeatherContext() {
  const [context, setContext] = useState({
    weather: null,
    temp: null,
    timeOfDay: null,
    suggestion: null,
    loaded: false,
  });

  useEffect(() => {
    // Get time of day
    const hour = new Date().getHours();
    let timeOfDay;
    if (hour >= 5 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17 && hour < 21) timeOfDay = "evening";
    else timeOfDay = "night";

    // Get weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const key = process.env.REACT_APP_WEATHER_KEY;
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`
            );
            const data = await res.json();
            const weather = data.weather[0].main;
            const temp = Math.round(data.main.temp);
            const city = data.name;

            let suggestion = "";
            if (weather === "Rain") suggestion = "🌧️ It's raining — perfect time to stay cozy indoors!";
            else if (weather === "Clear" && temp > 25) suggestion = "☀️ Beautiful sunny day — consider a short walk!";
            else if (weather === "Clouds") suggestion = "⛅ Cloudy day — a warm drink might help your mood!";
            else if (weather === "Snow") suggestion = "❄️ Snowy outside — stay warm and cozy!";
            else if (temp < 15) suggestion = "🥶 It's cold outside — wrap up warm!";
            else suggestion = `🌤️ ${weather} in ${city} — ${temp}°C`;

            setContext({ weather, temp, timeOfDay, suggestion, city, loaded: true });
          } catch {
            setContext((prev) => ({ ...prev, timeOfDay, loaded: true }));
          }
        },
        () => {
          setContext((prev) => ({ ...prev, timeOfDay, loaded: true }));
        }
      );
    } else {
      setContext((prev) => ({ ...prev, timeOfDay, loaded: true }));
    }
  }, []);

  return context;
}

export default useWeatherContext;