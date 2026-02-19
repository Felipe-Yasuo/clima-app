import type { City, WeatherResponse } from "../types/weather";

type Props = {
    city: City;
    weather: WeatherResponse;
};

function formatDay(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
    });
}

export default function WeatherCard({ city, weather }: Props) {
    return (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-800/50 p-6">
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
                    <p className="text-slate-400">
                        Vento: {Math.round(weather.current.wind_speed_10m)} km/h
                    </p>
                </div>
            </div>

            <h3 className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-300">
                Próximos 5 dias
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {weather.daily.time.slice(0, 5).map((day, i) => (
                    <div
                        key={day}
                        className="rounded-xl border border-slate-700 bg-slate-900/40 p-3 text-center"
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
