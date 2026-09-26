import { Filme, Genero } from '@/types/tmdb'
import CardFilme from '@/components/CardFilme'
import FiltrosHome from '@/components/FiltrosHome'

// Revalida a cada 5 minutos em vez de force-dynamic
// Isso evita o timeout do serverless
export const revalidate = 300

const KEY = process.env.NEXT_PUBLIC_TMDB_KEY
const BASE = 'https://api.themoviedb.org/3'

async function fetchJson(url: string) {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 300 } })
    clearTimeout(timer)
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

  // Busca sequencial para evitar sobrecarga: gêneros primeiro, depois filmes
  const generos = await buscarGeneros()

  // Só busca as seções necessárias
  const cartaz = await buscarSecao('now_playing', pagina, genero, ano)
  const popular = temFiltro ? [] : await buscarSecao('popular', pagina, '', '')
  const topRated = temFiltro ? [] : await buscarSecao('top_rated', 1, '', '')

  const anos = Array.from({ length: 35 }, (_, i) => String(new Date().getFullYear() - i))

  function buildUrl(p: number) {
    const ps = new URLSearchParams()
    if (genero) ps.set('genero', genero)
    if (ano) ps.set('ano', ano)
    ps.set('pagina', String(p))
    return `/?${ps}`
  }

  const Grid = ({ filmes }: { filmes: Filme[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
      {filmes.map(f => <CardFilme key={f.id} filme={f} />)}
    </div>
  )

  const Paginacao = ({ p }: { p: number }) => (
    <div className="flex justify-center gap-3 mt-6">
      {p > 1 && (
        <a href={buildUrl(p - 1)} className="px-4 py-2 rounded-xl text-sm border transition-colors"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          ← Anterior
        </a>
      )}
      <span className="px-4 py-2 rounded-xl text-sm"
        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
        Página {p}
      </span>
      <a href={buildUrl(p + 1)} className="px-4 py-2 rounded-xl text-sm bg-gray-900 text-white hover:bg-gray-700 transition-colors">
        Próxima →
      </a>
    </div>
  )

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>FilmesApp</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Descubra filmes, crie suas listas e acompanhe o que assistiu
        </p>
      </div>

      <FiltrosHome generos={generos} anos={anos} generoAtivo={genero} anoAtivo={ano} paginaAtiva={pagina} />

      {temFiltro ? (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>🎬 Resultados filtrados</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {genero && generos.find(g => String(g.id) === genero)?.name}
            {genero && ano && ' · '}{ano}
          </p>
          {cartaz.length === 0
            ? <p className="py-10 text-center" style={{ color: 'var(--text-secondary)' }}>Nenhum filme encontrado.</p>
            : <><Grid filmes={cartaz} /><Paginacao p={pagina} /></>
          }
        </section>
      ) : (
        <>
          {cartaz.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🎬 Em cartaz</h2>
              <Grid filmes={cartaz} />
              <Paginacao p={pagina} />
            </section>
          )}
          {popular.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🔥 Mais populares</h2>
              <Grid filmes={popular} />
            </section>
          )}
          {topRated.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>⭐ Mais bem avaliados</h2>
              <Grid filmes={topRated} />
            </section>
          )}
        </>
      )}
    </main>
  )
}
