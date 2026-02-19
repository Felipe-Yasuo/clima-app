import { useState } from "react";
import { searchCity, fetchWeather } from "./services/weatherService";
import type { City, WeatherResponse } from "./types/weather";
import WeatherCard from "./components/WeatherCard";


export default function App() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (query.trim().length < 2) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const foundCity = await searchCity(query);
      setCity(foundCity);

      const weatherData = await fetchWeather(foundCity);
      setWeather(weatherData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Clima App 🌤️</h1>

        <div className="mt-6 flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite uma cidade"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 outline-none"
          />
          <button
            onClick={handleSearch}
            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold"
          >
            Buscar
          </button>
        </div>

        {loading && (
          <p className="mt-6 text-slate-300">Carregando dados...</p>
        )}

        {error && (
          <p className="mt-6 text-red-400">{error}</p>
        )}

        {city && weather && !loading && (
          <WeatherCard city={city} weather={weather} />
        )}

      </div>
    </div>
  );
}
