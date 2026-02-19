import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");

  function handleSearch() {
    alert(`Buscar cidade: ${query}`);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Clima App 🌤️</h1>
        <p className="mt-2 text-slate-300">
          Busque uma cidade e veja temperatura + previsão de 5 dias.
        </p>

        <div className="mt-6 flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite uma cidade (ex: Londrina)"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 outline-none focus:border-slate-500"
          />
          <button
            onClick={handleSearch}
            disabled={query.trim().length < 2}
            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold disabled:opacity-60"
          >
            Buscar
          </button>
        </div>

      </div>
    </div>
  );
}
