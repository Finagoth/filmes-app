'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Ator, RespostaPessoas } from '@/types/tmdb'

export default function PaginaAtores() {
  const [termo, setTermo] = useState('')
  const [atores, setAtores] = useState<Ator[]>([])
  const [carregando, setCarregando] = useState(false)
  const [buscou, setBuscou] = useState(false)

  async function buscar() {
    if (!termo.trim()) return
    setCarregando(true)
    setBuscou(true)
    const res = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&query=${encodeURIComponent(termo)}`
    )
    const dados: RespostaPessoas = await res.json()
    setAtores(dados.results)
    setCarregando(false)
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar atores e atrizes</h1>
      <p className="text-gray-500 mb-8 text-sm">Pesquise um nome e veja todos os filmes em que participou</p>

      <div className="flex gap-3 mb-10">
        <input
          type="text"
          value={termo}
          onChange={e => setTermo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && buscar()}
          placeholder="Ex: Tom Hanks, Fernanda Montenegro..."
          className="border border-gray-200 rounded-xl px-5 py-3 flex-1 text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
        />
        <button
          onClick={buscar}
          disabled={carregando}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {carregando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {!buscou && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🎭</p>
          <p className="text-gray-400 text-sm">Digite um nome acima para começar</p>
        </div>
      )}

      {buscou && !carregando && atores.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🎭</p>
          <p className="text-gray-500">Nenhum resultado para "{termo}"</p>
        </div>
      )}

      {!carregando && atores.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {atores.map(ator => {
            const urlFoto = ator.profile_path
              ? `https://image.tmdb.org/t/p/w300${ator.profile_path}`
              : null
            return (
              <Link key={ator.id} href={`/atores/${ator.id}`} className="group block">
                <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[2/3] bg-gray-200">
                    {urlFoto ? (
                      <Image
                        src={urlFoto}
                        alt={ator.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">👤</div>
                    )}
                  </div>
                  <div className="p-3" style={{ minHeight: '60px' }}>
                    <h2 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{ator.name}</h2>
                    <p className="text-xs text-gray-400 mt-1">{ator.known_for_department === 'Acting' ? 'Ator/Atriz' : ator.known_for_department}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
