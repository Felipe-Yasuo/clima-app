import WeatherCard from "./components/WeatherCard";
import { useWeather } from "./hooks/useWeather";
import { useTheme } from "./context/ThemeContext";

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
  const { theme, toggleTheme } = useTheme();
  const {
    query,
    setQuery,
    canSearch,
    city,
    weather,
    loading,
    error,
    search,
    locating,
    useMyLocation,
  } = useWeather();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
        <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-500/10" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Clima App <span className="align-middle">🌤️</span>
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Busque uma cidade e veja temperatura atual + previsão de 5 dias.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50
                       dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? "Modo claro ☀️" : "Modo escuro 🌙"}
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg backdrop-blur
                        dark:border-slate-800 dark:bg-slate-900/60">

          <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite uma cidade (ex: São Paulo)"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none
                         focus:border-slate-300 focus:ring-4 focus:ring-blue-500/10
                         dark:border-slate-800 dark:bg-slate-950 dark:focus:border-slate-700 dark:focus:ring-blue-500/10"
            />

            <button
              type="submit"
              disabled={!canSearch || loading}
              className="rounded-xl bg-blue-600 px-5 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500
                         disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={useMyLocation}
              disabled={loading || locating}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-slate-50
                         disabled:cursor-not-allowed disabled:opacity-60
                         dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
            >
              {locating ? "Localizando..." : "Usar minha localização 📍"}
            </button>

            <span className="self-center text-sm text-slate-500 dark:text-slate-400">
              Dica: Curitiba • Rio de Janeiro • Lisboa
            </span>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700
                            dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </div>
          )}

          {loading && <Skeleton />}

          {!loading && city && weather && <WeatherCard city={city} weather={weather} />}
        </div>
      </div>
    </div>
  );
}  