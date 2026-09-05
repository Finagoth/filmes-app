'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Ator, RespostaPessoas } from '@/types/tmdb'

export default function PaginaAtores() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qParam = searchParams.get('q') ?? ''

  const [termo, setTermo] = useState(qParam)
  const [atores, setAtores] = useState<Ator[]>([])
  const [carregando, setCarregando] = useState(false)
  const [buscou, setBuscou] = useState(false)

  useEffect(() => {
    if (qParam) {
      setTermo(qParam)
      buscarAtores(qParam)
    }
  }, [qParam])

  async function buscarAtores(q: string) {
    if (!q.trim()) return
    setCarregando(true)
    setBuscou(true)
    const res = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&query=${encodeURIComponent(q)}`
    )
    const dados: RespostaPessoas = await res.json()
    setAtores(dados.results ?? [])
    setCarregando(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!termo.trim()) return
    router.push(`/atores?q=${encodeURIComponent(termo.trim())}`)
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Buscar atores e atrizes</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Pesquise um nome e veja todos os filmes em que participou</p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
        <input
          type="text"
          value={termo}
          onChange={e => setTermo(e.target.value)}
          placeholder="Ex: Tom Hanks, Fernanda Montenegro..."
          className="flex-1 border rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
        />
        <button type="submit" disabled={carregando}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
          {carregando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {!buscou && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🎭</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Digite um nome acima para começar</p>
        </div>
      )}

      {buscou && !carregando && atores.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🎭</p>
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum resultado para "{termo}"</p>
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
                <div className="rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="relative w-full aspect-[2/3] bg-gray-200 flex-shrink-0">
                    {urlFoto ? (
                      <Image src={urlFoto} alt={ator.name} fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">👤</div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col justify-between" style={{ minHeight: '68px' }}>
                    <h2 className="font-semibold text-sm leading-tight line-clamp-2" style={{ color: 'var(--text-primary)' }}>{ator.name}</h2>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {ator.known_for_department === 'Acting' ? 'Ator / Atriz' : ator.known_for_department}
                    </p>
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
