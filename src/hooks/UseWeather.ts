import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useDebounce } from "./useDebounce";
import { fetchWeather, fetchWeatherByCoords, searchCity } from "../services/weatherService";
import type { HistoryItem } from "../types/history";
import type { City, WeatherResponse } from "../types/weather";

const HISTORY_KEY = "weather_search_history";
const HISTORY_LIMIT = 5;

export function useWeather() {
    const [query, setQuery] = useState("");
    const [city, setCity] = useState<City | null>(null);
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [locating, setLocating] = useState(false);
    const [error, setError] = useState("");

    const [history, setHistory] = useState<HistoryItem[]>(() => {
        const raw = localStorage.getItem(HISTORY_KEY);
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw) as HistoryItem[];
            return Array.isArray(parsed) ? parsed.slice(0, HISTORY_LIMIT) : [];
        } catch {
            return [];
        }
    });

    const canSearch = useMemo(() => query.trim().length >= 2, [query]);
    const debouncedQuery = useDebounce(query, 600);
    const lastAutoQueryRef = useRef<string>("");


    const addToHistory = useCallback((item: HistoryItem) => {
        setHistory((prev) => {
            const filtered = prev.filter(
                (h) =>
                    !(
                        h.name.toLowerCase() === item.name.toLowerCase() &&
                        (h.country || "").toLowerCase() === (item.country || "").toLowerCase()
                    )
            );

            const next = [item, ...filtered].slice(0, HISTORY_LIMIT);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    async function search(e?: React.FormEvent) {
        e?.preventDefault();
        if (!canSearch || loading) return;

        setLoading(true);
        setError("");
        setWeather(null);

        try {
            const foundCity = await searchCity(query.trim());
            setCity(foundCity);

            addToHistory({
                name: foundCity.name,
                country: foundCity.country,
                latitude: foundCity.latitude,
                longitude: foundCity.longitude,
            });

            const weatherData = await fetchWeather(foundCity);
            setWeather(weatherData);
        } catch (err) {
            setCity(null);
            setWeather(null);
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
        setLocating(false);
    }

    const searchAuto = useCallback(async (name: string) => {
        if (loading || locating) return;
        if (name.trim().length < 2) return;

        setLoading(true);
        setError("");
        setWeather(null);

        try {
            const foundCity = await searchCity(name.trim());
            setCity(foundCity);

            addToHistory({
                name: foundCity.name,
                country: foundCity.country,
                latitude: foundCity.latitude,
                longitude: foundCity.longitude,
            });

            const weatherData = await fetchWeather(foundCity);
            setWeather(weatherData);
        } catch (err) {
            setCity(null);
            setWeather(null);
            if (err instanceof Error) setError(err.message);
            else setError("Erro inesperado.");
        } finally {
            setLoading(false);
        }
    }, [loading, locating, addToHistory]);


    function useMyLocation() {
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

                    const cityFallback: City = {
                        name: "Minha localização",
                        country: "",
                        latitude,
                        longitude,
                        timezone: "auto",
                    };

                    setCity(cityFallback);

                    addToHistory({
                        name: cityFallback.name,
                        country: cityFallback.country,
                        latitude,
                        longitude,
                    });

                    const w = await fetchWeatherByCoords(latitude, longitude, "auto");
                    setWeather(w);
                } catch (err) {
                    setCity(null);
                    setWeather(null);
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
                setCity(null);
                setWeather(null);

                if (geoErr.code === 1) setError("Permissão negada para acessar localização.");
                else if (geoErr.code === 2) setError("Localização indisponível no momento.");
                else if (geoErr.code === 3) setError("Tempo esgotado ao obter localização.");
                else setError("Erro ao obter localização.");
            },
            { enableHighAccuracy: false, timeout: 10000 }
        );
    }

    async function searchFromHistory(item: HistoryItem) {
        if (!item.name) return;

        setQuery(item.name);
        setLoading(true);
        setError("");
        setWeather(null);

        try {
            if (item.latitude != null && item.longitude != null) {
                const cityFallback: City = {
                    name: item.name,
                    country: item.country || "",
                    latitude: item.latitude,
                    longitude: item.longitude,
                    timezone: "auto",
                };

                setCity(cityFallback);

                const w = await fetchWeatherByCoords(item.latitude, item.longitude, "auto");
                setWeather(w);

                addToHistory(item);
                return;
            }


            const foundCity = await searchCity(item.name);
            setCity(foundCity);

            addToHistory({
                name: foundCity.name,
                country: foundCity.country,
                latitude: foundCity.latitude,
                longitude: foundCity.longitude,
            });

            const w = await fetchWeather(foundCity);
            setWeather(w);
        } catch (err) {
            setCity(null);
            setWeather(null);
            if (err instanceof Error) setError(err.message);
            else setError("Erro inesperado.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const name = debouncedQuery.trim();

        if (name.length < 2) return;
        if (loading || locating) return;

        if (lastAutoQueryRef.current === name.toLowerCase()) return;

        lastAutoQueryRef.current = name.toLowerCase();

        searchAuto(name);
    }, [debouncedQuery, loading, locating, searchAuto]);

    useEffect(() => {
        lastAutoQueryRef.current = "";
    }, [query]);

    return {
        query,
        setQuery,
        canSearch,
        city,
        weather,
        loading,
        locating,
        error,
        search,
        reset,
        useMyLocation,
        history,
        searchFromHistory,
    };
}