'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Filme } from '@/types/tmdb'
import CardFilme from '@/components/CardFilme'

export default function BuscaFilmes() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const qParam = searchParams.get('q') ?? ''
  const pageParam = Number(searchParams.get('pagina') ?? 1)

  const [termo, setTermo] = useState(qParam)
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [buscou, setBuscou] = useState(false)

  useEffect(() => {
    if (qParam) {
      setTermo(qParam)
      buscarFilmes(qParam, pageParam)
    }
  }, [qParam, pageParam])

  async function buscarFilmes(q: string, page: number) {
    if (!q.trim()) return
    setCarregando(true)
    setBuscou(true)

    // Busca 2 páginas para montar 25 resultados
    const [res1, res2] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&query=${encodeURIComponent(q)}&page=${page}`),
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&query=${encodeURIComponent(q)}&page=${page + 1}`),
    ])
    const d1 = await res1.json()
    const d2 = res2.ok ? await res2.json() : { results: [] }

    const combinados: Filme[] = [...(d1.results ?? []), ...(d2.results ?? [])].slice(0, 25)
    setFilmes(combinados)
    setTotalPaginas(Math.min(d1.total_pages ?? 1, 20))
    setCarregando(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!termo.trim()) return
    router.push(`/busca?q=${encodeURIComponent(termo.trim())}&pagina=1`)
  }

  function irParaPagina(p: number) {
    router.push(`/busca?q=${encodeURIComponent(qParam)}&pagina=${p}`)
  }

  return (
    <>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="aspect-[2/3] bg-gray-300" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!carregando && filmes.length > 0 && (
        <>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Mostrando resultados para{' '}
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>"{qParam}"</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {filmes.map(f => <CardFilme key={f.id} filme={f} />)}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
              {pageParam > 1 && (
                <button onClick={() => irParaPagina(pageParam - 1)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-colors border"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                  ← Anterior
                </button>
              )}
              <span className="text-sm px-3 py-2 rounded-xl"
                style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}>
                {pageParam} / {totalPaginas}
              </span>
              {pageParam < totalPaginas && (
                <button onClick={() => irParaPagina(pageParam + 1)}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
                  Próxima →
                </button>
              )}
            </div>
          )}
        </>
      )}

      {!carregando && buscou && filmes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🎬</p>
          <p style={{ color: 'var(--text-secondary)' }}>Nenhum resultado para "{qParam}"</p>
        </div>
      )}

      {!buscou && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Digite um título acima para começar</p>
        </div>
      )}
    </>
  )
}
