import { useState } from 'react';
import './App.css';

const API_KEY = '823dfed2a6fb1ca7049d416cb9386c99';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          cityName,
        )}&appid=${API_KEY}&units=metric`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('City not found');
        } else {
          setError('Unable to load weather data');
        }
        return;
      }

      const data = await response.json();
      setWeather({
        name: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
      });
    } catch (fetchError) {
      setError('Unable to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }
    await fetchWeather(city.trim());
  };

  return (
    <div className="app-shell">
      <div className="weather-card">
        <header className="weather-header">
          <div>
            <p className="eyebrow">Agawin's Weather Finder</p>
            <h1>Search current weather</h1>
          </div>
          <p className="subtitle">Type any city and press search to view the latest temperature and condition.</p>
        </header>

        <form className="search-form" onSubmit={handleSubmit}>
          <label htmlFor="city-input" className="sr-only">
            City name
          </label>
          <input
            id="city-input"
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="city-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <div className="status-block">
          {loading && <p className="status-message">Loading...</p>}
          {error && !loading && <p className="status-message error">{error}</p>}
          {weather && !loading && !error && (
            <div className="weather-details">
              <div className="weather-info">
                <h2>{weather.name}</h2>
                <p className="temp">{weather.temperature}°C</p>
                <p className="condition">{weather.condition}</p>
              </div>
              <p className="description">{weather.description}</p>
            </div>
          )}
        </div>
      </div>

      <footer className="app-footer">
        <p className="footer-title">FINALS HANDS-ON QUIZ #2: Weather Finder Application</p>
        <p>© 2026 Joshua Ezekiel Agawin. All rights reserved.</p>
        <p>BSIT-2C</p>
      </footer>
    </div>
  );
}

export default App;
