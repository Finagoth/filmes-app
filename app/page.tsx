import { Suspense } from 'react'
import { RespostaTMDB, Filme } from '@/types/tmdb'
import CardFilme from '@/components/CardFilme'
import GridSkeleton from '@/components/GridSkeleton'

export const dynamic = 'force-dynamic'

async function buscarFilmes(): Promise<Filme[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`
    )
    if (!res.ok) return []
    const dados: RespostaTMDB = await res.json()
    return dados.results ?? []
  } catch {
    return []
  }
}

async function ListaFilmes() {
  const filmes = await buscarFilmes()
  if (filmes.length === 0) {
    return <p className="text-gray-400">Não foi possível carregar os filmes.</p>
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {filmes.map(filme => (
        <CardFilme key={filme.id} filme={filme} />
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Em cartaz</h1>
      <p className="text-gray-500 mb-8 text-sm">Filmes atualmente nos cinemas</p>
      <Suspense fallback={<GridSkeleton />}>
        <ListaFilmes />
      </Suspense>
    </main>
  )
}
