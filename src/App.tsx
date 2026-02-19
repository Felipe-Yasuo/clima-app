import WeatherCard from "./components/WeatherCard";
import { useWeather } from "./hooks/UseWeather";

function Skeleton() {
  return (
    <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-800/50 p-6 animate-pulse">
      <div className="h-6 w-1/3 rounded bg-slate-700" />
      <div className="mt-3 h-4 w-1/4 rounded bg-slate-700" />
      <div className="mt-6 h-10 w-1/2 rounded bg-slate-700" />
      <div className="mt-2 h-4 w-1/3 rounded bg-slate-700" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-slate-700" />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const {
    query,
    setQuery,
    canSearch,
    city,
    weather,
    loading,
    error,
    search,
  } = useWeather();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Clima App 🌤️</h1>
        <p className="mt-2 text-slate-300">
          Busque uma cidade e veja temperatura atual + previsão de 5 dias.
        </p>

        <form onSubmit={search} className="mt-6 flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite uma cidade (ex: São Paulo)"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 outline-none focus:border-slate-500"
          />
          <button
            type="submit"
            disabled={!canSearch || loading}
            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500 disabled:opacity-60 disabled:hover:bg-blue-600"
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>

        {!loading && !error && !weather && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-800/30 p-6 text-slate-300">
            <p>
              Dica: tente <span className="font-semibold">Curitiba</span>,{" "}
              <span className="font-semibold">Rio de Janeiro</span> ou{" "}
              <span className="font-semibold">Lisboa</span>.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {loading && <Skeleton />}

        {!loading && city && weather && (
          <WeatherCard city={city} weather={weather} />
        )}
      </div>
    </div>
  );
}
