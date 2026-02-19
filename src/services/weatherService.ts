import type { City, WeatherResponse, GeocodingResponse } from "../types/weather";


async function safeFetch(url: string) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} ao acessar API`);
        return res;
    } catch {
        throw new Error("Failed to fetch (rede/CORS/bloqueio). Verifique sua conexão ou bloqueadores.");
    }
}


export async function searchCity(name: string): Promise<City> {
    const url =
        `https://geocoding-api.open-meteo.com/v1/search` +
        `?name=${encodeURIComponent(name)}` +
        `&count=1&language=pt&format=json`;

    const res = await safeFetch(url);
    if (!res.ok) {
        throw new Error("Falha ao buscar a cidade.");
    }

    const data = (await res.json()) as GeocodingResponse;

    if (!data.results || data.results.length === 0) {
        throw new Error("Cidade não encontrada. Tenta outro nome");
    }

    const c = data.results[0];

    return {
        name: c.name,
        country: c.country,
        latitude: c.latitude,
        longitude: c.longitude,
        timezone: c.timezone,
    };
}

export async function fetchWeather(city: City): Promise<WeatherResponse> {
    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${city.latitude}&longitude=${city.longitude}` +
        `&current=temperature_2m,wind_speed_10m,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min` +
        `&timezone=${encodeURIComponent(city.timezone)}`;


    const res = await safeFetch(url);
    if (!res.ok) {
        throw new Error("Falha ao buscar previsão do tempo.");
    }

    const data = (await res.json()) as WeatherResponse;
    return data;
}

export async function fetchWeatherByCoords(
    latitude: number,
    longitude: number,
    timezone: string
): Promise<WeatherResponse> {
    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,wind_speed_10m,weather_code` +
        `&daily=temperature_2m_max,temperature_2m_min` +
        `&timezone=${encodeURIComponent(timezone)}`;

    const res = await safeFetch(url);
    if (!res.ok) throw new Error("Falha ao buscar previsão do tempo.");
    return (await res.json()) as WeatherResponse;
}
