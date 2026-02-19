import { useMemo, useState } from "react";
import {
    fetchWeather,
    fetchWeatherByCoords,
    searchCity,
} from "../services/weatherService";

import type { City, WeatherResponse } from "../types/weather";

export function useWeather() {
    const [query, setQuery] = useState("");
    const [city, setCity] = useState<City | null>(null);
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [locating, setLocating] = useState(false);


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

    async function useMyLocation() {
        if (!navigator.geolocation) {
            setError("Seu navegador não suporta geolocalização.");
            return;
        }

        setLocating(true);
        setLoading(true);
        setError("");
        setWeather(null);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;

                    const cityFallback = {
                        name: "Minha localização",
                        country: "",
                        latitude,
                        longitude,
                        timezone: "auto",
                    };

                    setCity(cityFallback);

                    const w = await fetchWeatherByCoords(latitude, longitude, "auto");
                    setWeather(w);

                } catch (err) {
                    setCity(null);
                    if (err instanceof Error) setError(err.message);
                    else setError("Erro inesperado ao usar localização.");
                } finally {
                    setLoading(false);
                    setLocating(false);
                }
            },
            (geoErr) => {
                setLoading(false);
                setLocating(false);

                // mensagens amigáveis
                if (geoErr.code === 1) setError("Permissão negada para acessar localização.");
                else if (geoErr.code === 2) setError("Localização indisponível no momento.");
                else if (geoErr.code === 3) setError("Tempo esgotado ao obter localização.");
                else setError("Erro ao obter localização.");
            },
            { enableHighAccuracy: false, timeout: 10000 }
        );
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
        locating,
        useMyLocation,

    };
}

