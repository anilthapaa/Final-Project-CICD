import React, { useState } from "react";

const isDev = process.env.NODE_ENV === "development";

export default function WeatherFetcher() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);


  const apiKey = isDev
  ? process.env.REACT_APP_OPEN_WEATHER_API_KEY
  : "__API_KEY_PLACEHOLDER__";



  async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    return {
      temperature: data.main.temp,
      city: data.name,
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  }

  async function handleGetWeather() {
    if (!city.trim()) {
      setResult("Please enter a city name.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const data = await fetchWeather(city.trim());
      setResult(data);
    } catch (err) {
      setResult(err.message);
    }

    setLoading(false);
  }

  return (
    <>
      <div className="container">
        <div className="card">
          <h1 className="title">🌤️ Today Weather?</h1>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="input"
            disabled={loading}
          />
          <button
            onClick={handleGetWeather}
            disabled={loading}
            className="button"
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>

          <div className="result">
            {typeof result === "string" && result && (
              <p className="error">{result}</p>
            )}
            {typeof result === "object" && result.city && (
              <div className="weather-info">
                <h2>
                  Weather in <span className="city">{result.city}</span>
                </h2>
                <div className="weather-details">
                  <img
                    src={`https://openweathermap.org/img/wn/${result.icon}@2x.png`}
                    alt={result.condition}
                    className="weather-icon"
                  />
                  <p className="temp">{Math.round(result.temperature)}°C</p>
                </div>
                <p className="condition">{result.condition}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        * {
          box-sizing: border-box;
        }
        body, html, #root {
          height: 100%;
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          padding: 2rem;
          width: 100%;
          max-width: 400px;
        }
        .card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 2rem 2.5rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          text-align: center;
          transition: box-shadow 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.6);
        }
        .title {
          margin-bottom: 1.5rem;
          font-weight: 600;
          font-size: 2.2rem;
          letter-spacing: 1.2px;
          text-shadow: 0 0 6px rgba(255,255,255,0.7);
        }
        .input {
          width: 100%;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          border: none;
          font-size: 1rem;
          margin-bottom: 1rem;
          outline: none;
          transition: box-shadow 0.2s ease;
          background: rgba(255, 255, 255, 0.25);
          color: #fff;
        }
        .input:focus {
          box-shadow: 0 0 8px 2px #a29bfe;
          background: rgba(255, 255, 255, 0.4);
        }
        .button {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #6c5ce7;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          cursor: pointer;
          box-shadow: 0 6px 20px #6c5ce7aa;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }
        .button:hover:not(:disabled) {
          background: #4834d4;
          box-shadow: 0 8px 28px #4834d4cc;
        }
        .button:disabled {
          background: #a29bfe88;
          cursor: not-allowed;
          box-shadow: none;
        }
        .result {
          margin-top: 1.8rem;
          min-height: 120px;
          font-weight: 500;
          text-shadow: 0 0 5px rgba(0,0,0,0.4);
        }
        .error {
          color: #ff6b6b;
          font-weight: 600;
          font-size: 1rem;
        }
        .weather-info h2 {
          margin: 0 0 0.75rem 0;
          font-weight: 700;
          font-size: 1.3rem;
          letter-spacing: 0.6px;
        }
        .city {
          color: #ffeaa7;
        }
        .weather-details {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.6rem;
        }
        .weather-icon {
          width: 72px;
          height: 72px;
        }
        .temp {
          font-size: 3.5rem;
          font-weight: 700;
          color: #ffeaa7;
          text-shadow: 0 0 10px #ffeaa7bb;
        }
        .condition {
          font-size: 1.1rem;
          font-style: italic;
          text-transform: capitalize;
          color: #dfe6e9;
        }
      `}</style>
    </>
  );
}