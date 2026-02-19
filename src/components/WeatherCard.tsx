import type { City, WeatherResponse } from "../types/weather";


type Props = {
    city: City;
    weather: WeatherResponse;
};

function getWeatherVisual(code: number) {
    if (code === 0) return { icon: "☀️", label: "Céu limpo" };
    if (code === 1 || code === 2) return { icon: "🌤️", label: "Poucas nuvens" };
    if (code === 3) return { icon: "☁️", label: "Nublado" };

    if (code === 45 || code === 48) return { icon: "🌫️", label: "Neblina" };

    if ([51, 53, 55, 56, 57].includes(code)) return { icon: "🌦️", label: "Garoa" };
    if ([61, 63, 65, 66, 67].includes(code)) return { icon: "🌧️", label: "Chuva" };

    if ([71, 73, 75, 77].includes(code)) return { icon: "🌨️", label: "Neve" };
    if ([80, 81, 82].includes(code)) return { icon: "🌧️", label: "Pancadas" };

    if ([95, 96, 99].includes(code)) return { icon: "⛈️", label: "Tempestade" };

    return { icon: "🌡️", label: "Clima" };
}


function formatDay(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
    });
}

export default function WeatherCard({ city, weather }: Props) {
    const visual = getWeatherVisual(weather.current.weather_code);

    return (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-md backdrop-blur
                dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">
                        {city.name}, {city.country}
                    </h2>
                    <p className="mt-1 text-slate-400">
                        Fuso: {city.timezone}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-4xl font-extrabold">
                        {Math.round(weather.current.temperature_2m)}°C
                    </p>
                    <p className="mt-1 text-slate-300">
                        <span className="mr-2">{visual.icon}</span>
                        {visual.label}
                    </p>
                    <p className="text-slate-400">
                        Vento: {Math.round(weather.current.wind_speed_10m)} km/h
                    </p>
                </div>

            </div>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-300">
                Próximos 5 dias
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5 ">
                {weather.daily.time.slice(0, 5).map((day, i) => (
                    <div
                        key={day}
                        className="rounded-xl border border-slate-200 bg-white p-3 text-center
                        dark:border-slate-800 dark:bg-slate-900/60"

                    >
                        <p className="text-sm font-semibold">{formatDay(day)}</p>

                        <p className="mt-2 text-lg font-bold">
                            {Math.round(weather.daily.temperature_2m_max[i])}°
                        </p>

                        <p className="text-sm text-slate-400">
                            {Math.round(weather.daily.temperature_2m_min[i])}°
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
