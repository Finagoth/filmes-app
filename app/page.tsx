import { Suspense } from 'react'
import { Filme, Genero } from '@/types/tmdb'
import CardFilme from '@/components/CardFilme'
import GridSkeleton from '@/components/GridSkeleton'
import FiltrosHome from '@/components/FiltrosHome'

export const dynamic = 'force-dynamic'

async function buscarGeneros(): Promise<Genero[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`
    )
    if (!res.ok) return []
    const dados = await res.json()
    return dados.genres ?? []
  } catch { return [] }
}

async function buscarFilmes(
  endpoint: string,
  page: number,
  generoId?: string,
  ano?: string
): Promise<{ filmes: Filme[]; totalPaginas: number }> {
  try {
    let url: string

    if (generoId || ano) {
      const sortMap: Record<string, string> = {
        now_playing: 'popularity.desc',
        popular: 'popularity.desc',
        top_rated: 'vote_average.desc',
      }
      const sort = sortMap[endpoint] ?? 'popularity.desc'
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&page=${page}&sort_by=${sort}`
      if (generoId) url += `&with_genres=${generoId}`
      if (ano) url += `&primary_release_year=${ano}`
      if (endpoint === 'top_rated') url += '&vote_count.gte=200'
    } else {
      url = `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&page=${page}`
    }

    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return { filmes: [], totalPaginas: 1 }
    const dados = await res.json()

    // Pega 25 filmes (5 fileiras × 5 colunas)
    // API retorna 20 por página — se precisar de 25 busca página seguinte também
    let filmes: Filme[] = dados.results ?? []
    if (filmes.length < 25) {
      const res2 = await fetch(url.replace(`&page=${page}`, `&page=${page + 1}`), { next: { revalidate: 300 } })
      if (res2.ok) {
        const dados2 = await res2.json()
        filmes = [...filmes, ...(dados2.results ?? [])]
      }
    }

    return {
      filmes: filmes.slice(0, 25),
      totalPaginas: Math.min(dados.total_pages ?? 1, 20),
    }
  } catch { return { filmes: [], totalPaginas: 1 } }
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

  const [generos, secCartaz, secPopular, secTop] = await Promise.all([
    buscarGeneros(),
    buscarFilmes('now_playing', pagina, genero, ano),
    buscarFilmes('popular', pagina, genero, ano),
    buscarFilmes('top_rated', 1, genero, ano),
  ])

  const anos = Array.from({ length: 35 }, (_, i) => String(new Date().getFullYear() - i))

  const Grid = ({ filmes }: { filmes: Filme[] }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
      {filmes.map(f => <CardFilme key={f.id} filme={f} />)}
    </div>
  )

  return (
    <>
      <FiltrosHome
        generos={generos}
        anos={anos}
        generoAtivo={genero}
        anoAtivo={ano}
        paginaAtiva={pagina}
      />

      {temFiltro ? (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            🎬 Resultados filtrados
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {genero && generos.find(g => String(g.id) === genero)?.name}
            {genero && ano && ' · '}
            {ano}
          </p>
          {secCartaz.filmes.length === 0 ? (
            <p className="py-10 text-center" style={{ color: 'var(--text-secondary)' }}>
              Nenhum filme encontrado com esses filtros.
            </p>
          ) : (
            <Grid filmes={secCartaz.filmes} />
          )}
          <Paginacao pagina={pagina} total={secCartaz.totalPaginas} genero={genero} ano={ano} />
        </section>
      ) : (
        <>
          {secCartaz.filmes.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🎬 Em cartaz</h2>
              <Grid filmes={secCartaz.filmes} />
              <Paginacao pagina={pagina} total={secCartaz.totalPaginas} genero={genero} ano={ano} />
            </section>
          )}

          {secPopular.filmes.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🔥 Mais populares</h2>
              <Grid filmes={secPopular.filmes} />
            </section>
          )}

          {secTop.filmes.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>⭐ Mais bem avaliados</h2>
              <Grid filmes={secTop.filmes} />
            </section>
          )}
        </>
      )}
    </>
  )
}

function Paginacao({ pagina, total, genero, ano }: { pagina: number; total: number; genero: string; ano: string }) {
  if (total <= 1) return null

  function buildUrl(p: number) {
    const ps = new URLSearchParams()
    if (genero) ps.set('genero', genero)
    if (ano) ps.set('ano', ano)
    ps.set('pagina', String(p))
    return `/?${ps.toString()}`
  }

  return (
    <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
      {pagina > 1 && (
        <a href={buildUrl(pagina - 1)}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-colors border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          ← Anterior
        </a>
      )}
      <span className="text-sm px-3 py-2 rounded-xl"
        style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)' }}>
        {pagina} / {total}
      </span>
      {pagina < total && (
        <a href={buildUrl(pagina + 1)}
          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
          Próxima →
        </a>
      )}
    </div>
  )
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>FilmesApp</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Descubra filmes, crie suas listas e acompanhe o que assistiu
        </p>
      </div>
      <Suspense fallback={<GridSkeleton />}>
        <ConteudoHome searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
