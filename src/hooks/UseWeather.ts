import { useMemo, useState } from "react";
import { fetchWeather, searchCity } from "../services/weatherService";
import type { City, WeatherResponse } from "../types/weather";

export function useWeather() {
    const [query, setQuery] = useState("");
    const [city, setCity] = useState<City | null>(null);
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const canSearch = useMemo(() => query.trim().length >= 2, [query]);

    async function search(e?: React.FormEvent) {
        e?.preventDefault();
        if (!canSearch || loading) return;

        setLoading(true);
        setError("");
        setWeather(null);

        try {
            const foundCity = await searchCity(query.trim());
            setCity(foundCity);

            const weatherData = await fetchWeather(foundCity);
            setWeather(weatherData);
        } catch (err) {
            setCity(null);
            if (err instanceof Error) setError(err.message);
            else setError("Erro inesperado.");
        } finally {
            setLoading(false);
        }
    }

    function reset() {
        setQuery("");
        setCity(null);
        setWeather(null);
        setError("");
        setLoading(false);
    }

    return {
        query,
        setQuery,
        canSearch,
        city,
        weather,
        loading,
        error,
        search,
        reset,
    };
}
