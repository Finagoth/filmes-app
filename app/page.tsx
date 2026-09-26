import { Suspense } from 'react'
import { Filme, Genero } from '@/types/tmdb'
import CardFilme from '@/components/CardFilme'
import GridSkeleton from '@/components/GridSkeleton'
import FiltrosHome from '@/components/FiltrosHome'

export const dynamic = 'force-dynamic'

const KEY = process.env.NEXT_PUBLIC_TMDB_KEY
const BASE = 'https://api.themoviedb.org/3'

async function fetchJson(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function buscarGeneros(): Promise<Genero[]> {
  const d = await fetchJson(`${BASE}/genre/movie/list?api_key=${KEY}&language=pt-BR`)
  return d?.genres ?? []
}

async function buscarSecao(
  endpoint: string,
  page: number,
  generoId: string,
  ano: string
): Promise<Filme[]> {
  let url: string
  if (generoId || ano) {
    const sort = endpoint === 'top_rated' ? 'vote_average.desc' : 'popularity.desc'
    const extra = endpoint === 'top_rated' ? '&vote_count.gte=200' : ''
    const g = generoId ? `&with_genres=${generoId}` : ''
    const a = ano ? `&primary_release_year=${ano}` : ''
    url = `${BASE}/discover/movie?api_key=${KEY}&language=pt-BR&page=${page}&sort_by=${sort}${g}${a}${extra}`
  } else {
    url = `${BASE}/movie/${endpoint}?api_key=${KEY}&language=pt-BR&page=${page}`
  }
  const d = await fetchJson(url)
  return d?.results?.slice(0, 20) ?? []
}

interface HomeProps {
  searchParams: Promise<{ pagina?: string; genero?: string; ano?: string }>
}

async function ConteudoHome({ searchParams }: HomeProps) {
  const params = await searchParams
  const pagina = Math.max(1, Number(params.pagina ?? 1))
  const genero = params.genero ?? ''
  const ano = params.ano ?? ''
  const temFiltro = !!(genero || ano)

  const [generos, cartaz, popular, topRated] = await Promise.all([
    buscarGeneros(),
    buscarSecao('now_playing', pagina, genero, ano),
    buscarSecao('popular', pagina, genero, ano),
    buscarSecao('top_rated', 1, genero, ano),
  ])

  const anos = Array.from({ length: 35 }, (_, i) => String(new Date().getFullYear() - i))

  const Grid = ({ filmes }: { filmes: Filme[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
      {filmes.map(f => <CardFilme key={f.id} filme={f} />)}
    </div>
  )

  return (
    <>
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
            : <Grid filmes={cartaz} />
          }
          <Paginacao pagina={pagina} genero={genero} ano={ano} />
        </section>
      ) : (
        <>
          {cartaz.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🎬 Em cartaz</h2>
              <Grid filmes={cartaz} />
              <Paginacao pagina={pagina} genero={genero} ano={ano} />
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
    </>
  )
}

function Paginacao({ pagina, genero, ano }: { pagina: number; genero: string; ano: string }) {
  function url(p: number) {
    const ps = new URLSearchParams()
    if (genero) ps.set('genero', genero)
    if (ano) ps.set('ano', ano)
    ps.set('pagina', String(p))
    return `/?${ps}`
  }
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {pagina > 1 && (
        <a href={url(pagina - 1)} className="px-4 py-2 rounded-xl text-sm font-medium border transition-colors"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          ← Anterior
        </a>
      )}
      <span className="text-sm px-3 py-2 rounded-xl" style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}>
        Página {pagina}
      </span>
      <a href={url(pagina + 1)} className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
        Próxima →
      </a>
    </div>
  )
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>FilmesApp</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Descubra filmes, crie suas listas e acompanhe o que assistiu</p>
      </div>
      <Suspense fallback={<GridSkeleton />}>
        <ConteudoHome searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
