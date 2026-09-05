'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Filme } from '@/types/tmdb'
import CardFilme from '@/components/CardFilme'

export default function PaginaBusca() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qParam = searchParams.get('q') ?? ''

  const [termo, setTermo] = useState(qParam)
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [carregando, setCarregando] = useState(false)
  const [buscou, setBuscou] = useState(false)

  useEffect(() => {
    if (qParam) {
      setTermo(qParam)
      buscarFilmes(qParam)
    }
  }, [qParam])

  async function buscarFilmes(q: string) {
    if (!q.trim()) return
    setCarregando(true)
    setBuscou(true)
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&query=${encodeURIComponent(q)}`
    )
    const dados = await res.json()
    setFilmes(dados.results ?? [])
    setCarregando(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!termo.trim()) return
    router.push(`/busca?q=${encodeURIComponent(termo.trim())}`)
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Buscar filmes</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Encontre qualquer filme pelo título</p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-10">
        <input
          type="text"
          value={termo}
          onChange={e => setTermo(e.target.value)}
          placeholder="Ex: Interestelar, Matrix, Oppenheimer..."
          className="flex-1 border rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
        />
        <button type="submit" disabled={carregando}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
          {carregando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {carregando && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!carregando && filmes.length > 0 && (
        <>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {filmes.length} resultado{filmes.length !== 1 ? 's' : ''} para{' '}
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>"{termo}"</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filmes.map(f => <CardFilme key={f.id} filme={f} />)}
          </div>
        </>
      )}

      {!carregando && buscou && filmes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Nenhum resultado para "{termo}"</p>
        </div>
      )}

      {!buscou && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Digite um título acima para começar</p>
        </div>
      )}
    </main>
  )
}
