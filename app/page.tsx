import { Suspense } from 'react'
import Link from 'next/link'
import { RespostaTMDB, Filme } from '@/types/tmdb'
import CardFilme from '@/components/CardFilme'
import GridSkeleton from '@/components/GridSkeleton'

export const dynamic = 'force-dynamic'

async function buscarSecao(endpoint: string): Promise<Filme[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`
    )
    if (!res.ok) return []
    const dados: RespostaTMDB = await res.json()
    return dados.results?.slice(0, 10) ?? []
  } catch {
    return []
  }
}

function SecaoFilmes({ titulo, filmes, href }: { titulo: string; filmes: Filme[]; href?: string }) {
  if (filmes.length === 0) return null
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{titulo}</h2>
        {href && (
          <Link href={href} className="text-sm text-blue-600 hover:underline">Ver todos →</Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {filmes.map(filme => <CardFilme key={filme.id} filme={filme} />)}
      </div>
    </section>
  )
}

async function ConteudoHome() {
  const [emCartaz, populares, melhoresAvaliados, proximosLancamentos] = await Promise.all([
    buscarSecao('now_playing'),
    buscarSecao('popular'),
    buscarSecao('top_rated'),
    buscarSecao('upcoming'),
  ])

  return (
    <>
      <SecaoFilmes titulo="🎬 Em cartaz" filmes={emCartaz} />
      <SecaoFilmes titulo="🔥 Mais populares" filmes={populares} />
      <SecaoFilmes titulo="⭐ Mais bem avaliados" filmes={melhoresAvaliados} />
      <SecaoFilmes titulo="🗓️ Próximos lançamentos" filmes={proximosLancamentos} />
    </>
  )
}

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">FilmesApp</h1>
        <p className="text-gray-500 text-sm">Descubra filmes, crie suas listas e acompanhe o que assistiu</p>
      </div>
      <Suspense fallback={<GridSkeleton />}>
        <ConteudoHome />
      </Suspense>
    </main>
  )
}
