"use client";

import { useState } from "react";
import { Filme } from "@/types/tmdb";
import CardFilme from "@/components/CardFilme";

export default function PaginaBusca() {
  const [termo, setTermo] = useState("");
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [buscou, setBuscou] = useState(false);

  async function buscar() {
    if (!termo.trim()) return;
    setCarregando(true);
    setBuscou(true);
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&query=${encodeURIComponent(termo)}`,
    );
    const dados = await res.json();
    setFilmes(dados.results);
    setCarregando(false);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar filmes</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Encontre qualquer filme pelo título
      </p>

      {/* Campo de busca */}
      <div className="flex gap-3 mb-10">
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && buscar()}
          placeholder="Ex: Interestelar, Matrix, Oppenheimer..."
          className="border border-gray-200 rounded-xl px-5 py-3 flex-1 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
        />
        <button
          onClick={buscar}
          disabled={carregando}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {carregando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {/* Estado de carregando */}
      {carregando && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden bg-gray-100 animate-pulse"
            >
              <div className="aspect-[2/3] bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados */}
      {!carregando && filmes.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-6">
            {filmes.length} resultado{filmes.length !== 1 ? "s" : ""} para{" "}
            <span className="font-medium text-gray-900">"{termo}"</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filmes.map((filme) => (
              <CardFilme key={filme.id} filme={filme} />
            ))}
          </div>
        </>
      )}

      {/* Nenhum resultado */}
      {!carregando && buscou && filmes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-gray-500 text-lg">Nenhum filme encontrado para</p>
          <p className="font-semibold text-gray-900 text-lg">"{termo}"</p>
          <p className="text-gray-400 text-sm mt-2">Tente outro título</p>
        </div>
      )}

      {/* Estado inicial */}
      {!buscou && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-400 text-sm">
            Digite um título acima para começar
          </p>
        </div>
      )}
    </main>
  );
}
