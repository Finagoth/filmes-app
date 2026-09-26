import { Filme, Genero } from '@/types/tmdb'
import CardFilme from '@/components/CardFilme'
import FiltrosHome from '@/components/FiltrosHome'

export const dynamic = 'force-dynamic'

const KEY = process.env.NEXT_PUBLIC_TMDB_KEY
const BASE = 'https://api.themoviedb.org/3'

async function fetchJson(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function buscarGeneros(): Promise<Genero[]> {
  const d = await fetchJson(`${BASE}/genre/movie/list?api_key=${KEY}&language=pt-BR`)
  return d?.genres ?? []
}

async function buscarSecao(endpoint: string, page: number, generoId: string, ano: string): Promise<Filme[]> {
  let url: string
  if (generoId || ano) {
    const sort = endpoint === 'top_rated' ? 'vote_average.desc' : 'popularity.desc'
    const extra = endpoint === 'top_rated' ? '&vote_count.gte=200' : ''
    url = `${BASE}/discover/movie?api_key=${KEY}&language=pt-BR&page=${page}&sort_by=${sort}${generoId ? `&with_genres=${generoId}` : ''}${ano ? `&primary_release_year=${ano}` : ''}${extra}`
  } else {
    url = `${BASE}/movie/${endpoint}?api_key=${KEY}&language=pt-BR&page=${page}`
  }
  const d = await fetchJson(url)
  return d?.results?.slice(0, 20) ?? []
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Home({ searchParams }: PageProps) {
  const sp = await searchParams
  const pagina = Math.max(1, Number(sp.pagina ?? 1))
  const genero = String(sp.genero ?? '')
  const ano = String(sp.ano ?? '')
  const temFiltro = !!(genero || ano)

  const [generos, cartaz, popular, topRated] = await Promise.all([
    buscarGeneros(),
    buscarSecao('now_playing', pagina, genero, ano),
    buscarSecao('popular', pagina, genero, ano),
    buscarSecao('top_rated', 1, genero, ano),
  ])

  const anos = Array.from({ length: 35 }, (_, i) => String(new Date().getFullYear() - i))

  function buildUrl(p: number) {
    const ps = new URLSearchParams()
    if (genero) ps.set('genero', genero)
    if (ano) ps.set('ano', ano)
    ps.set('pagina', String(p))
    return `/?${ps}`
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          FilmesApp
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Descubra filmes, crie suas listas e acompanhe o que assistiu
        </p>
      </div>

      <FiltrosHome generos={generos} anos={anos} generoAtivo={genero} anoAtivo={ano} paginaAtiva={pagina} />

      {temFiltro ? (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            🎬 Resultados filtrados
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {genero && generos.find(g => String(g.id) === genero)?.name}
            {genero && ano && ' · '}{ano}
          </p>
          {cartaz.length === 0 ? (
            <p className="py-10 text-center" style={{ color: 'var(--text-secondary)' }}>
              Nenhum filme encontrado com esses filtros.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {cartaz.map(f => <CardFilme key={f.id} filme={f} />)}
            </div>
          )}
          <div className="flex justify-center gap-3 mt-6">
            {pagina > 1 && (
              <a href={buildUrl(pagina - 1)} className="px-4 py-2 rounded-xl text-sm border transition-colors"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                ← Anterior
              </a>
            )}
            <span className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
              Página {pagina}
            </span>
            <a href={buildUrl(pagina + 1)} className="px-4 py-2 rounded-xl text-sm bg-gray-900 text-white hover:bg-gray-700 transition-colors">
              Próxima →
            </a>
          </div>
        </section>
      ) : (
        <>
          {cartaz.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🎬 Em cartaz</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                {cartaz.map(f => <CardFilme key={f.id} filme={f} />)}
              </div>
              <div className="flex justify-center gap-3 mt-6">
                {pagina > 1 && (
                  <a href={buildUrl(pagina - 1)} className="px-4 py-2 rounded-xl text-sm border transition-colors"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                    ← Anterior
                  </a>
                )}
                <span className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                  Página {pagina}
                </span>
                <a href={buildUrl(pagina + 1)} className="px-4 py-2 rounded-xl text-sm bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                  Próxima →
                </a>
              </div>
            </section>
          )}
          {popular.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🔥 Mais populares</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                {popular.map(f => <CardFilme key={f.id} filme={f} />)}
              </div>
            </section>
          )}
          {topRated.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>⭐ Mais bem avaliados</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
                {topRated.map(f => <CardFilme key={f.id} filme={f} />)}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}
