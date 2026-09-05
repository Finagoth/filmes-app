import { Suspense } from 'react'
import { RespostaTMDB, Filme, Genero } from '@/types/tmdb'
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

async function buscarSecao(endpoint: string, page = 1, generoId?: string, ano?: string): Promise<{ filmes: Filme[], totalPaginas: number }> {
  try {
    let url = `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR&page=${page}`
    if (generoId) url += `&with_genres=${generoId}`
    if (ano) url += `&primary_release_year=${ano}`
    const res = await fetch(url)
    if (!res.ok) return { filmes: [], totalPaginas: 1 }
    const dados: RespostaTMDB = await res.json()
    return { filmes: dados.results?.slice(0, 10) ?? [], totalPaginas: dados.total_pages ?? 1 }
  } catch { return { filmes: [], totalPaginas: 1 } }
}

interface HomeProps {
  searchParams: Promise<{ pagina?: string; genero?: string; ano?: string }>
}

async function ConteudoHome({ searchParams }: HomeProps) {
  const params = await searchParams
  const pagina = Number(params.pagina ?? 1)
  const genero = params.genero ?? ''
  const ano = params.ano ?? ''

  const [
    generos,
    { filmes: emCartaz, totalPaginas: totalCartaz },
    { filmes: populares, totalPaginas: totalPopulares },
    { filmes: topRated },
  ] = await Promise.all([
    buscarGeneros(),
    buscarSecao('now_playing', pagina, genero, ano),
    buscarSecao('popular', pagina, genero, ano),
    buscarSecao('top_rated', 1, genero, ano),
  ])

  const anos = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))

  return (
    <>
      <FiltrosHome generos={generos} anos={anos} generoAtivo={genero} anoAtivo={ano} paginaAtiva={pagina} />

      {/* Em cartaz */}
      {emCartaz.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🎬 Em cartaz</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {emCartaz.map(f => <CardFilme key={f.id} filme={f} />)}
          </div>
          <Paginacao pagina={pagina} total={Math.min(totalCartaz, 20)} genero={genero} ano={ano} />
        </section>
      )}

      {/* Populares */}
      {populares.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>🔥 Mais populares</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {populares.map(f => <CardFilme key={f.id} filme={f} />)}
          </div>
        </section>
      )}

      {/* Mais bem avaliados */}
      {topRated.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>⭐ Mais bem avaliados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {topRated.map(f => <CardFilme key={f.id} filme={f} />)}
          </div>
        </section>
      )}
    </>
  )
}

function Paginacao({ pagina, total, genero, ano }: { pagina: number; total: number; genero: string; ano: string }) {
  const params = new URLSearchParams()
  if (genero) params.set('genero', genero)
  if (ano) params.set('ano', ano)

  const prev = new URLSearchParams(params)
  prev.set('pagina', String(pagina - 1))
  const next = new URLSearchParams(params)
  next.set('pagina', String(pagina + 1))

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {pagina > 1 && (
        <a href={`/?${prev}`} className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-sm font-medium hover:bg-gray-300 transition-colors">
          ← Anterior
        </a>
      )}
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Página {pagina} de {total}</span>
      {pagina < total && (
        <a href={`/?${next}`} className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
          Próxima →
        </a>
      )}
    </div>
  )
}

export default function Home({ searchParams }: HomeProps) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>FilmesApp</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Descubra filmes, crie suas listas e acompanhe o que assistiu</p>
      </div>
      <Suspense fallback={<GridSkeleton />}>
        <ConteudoHome searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
