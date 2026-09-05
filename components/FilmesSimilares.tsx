import Link from 'next/link'
import Image from 'next/image'
import { Filme, RespostaTMDB } from '@/types/tmdb'

interface Props {
  filmeId: number
}

async function buscarSimilares(id: number): Promise<Filme[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`
    )
    if (!res.ok) return []
    const dados: RespostaTMDB = await res.json()
    return dados.results.slice(0, 6)
  } catch {
    return []
  }
}

export default async function FilmesSimilares({ filmeId }: Props) {
  const similares = await buscarSimilares(filmeId)
  if (similares.length === 0) return null

  return (
    <section className="max-w-4xl mx-auto px-6 pb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Você também pode gostar</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {similares.map(filme => {
          const urlPoster = filme.poster_path
            ? `https://image.tmdb.org/t/p/w300${filme.poster_path}`
            : null
          return (
            <Link key={filme.id} href={`/filmes/${filme.id}`} className="group block">
              <div className="rounded-lg overflow-hidden bg-gray-100 aspect-[2/3] relative">
                {urlPoster ? (
                  <Image
                    src={urlPoster}
                    alt={filme.title}
                    fill
                    sizes="(max-width: 768px) 33vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sem imagem</div>
                )}
              </div>
              <p className="text-xs text-gray-700 mt-1 leading-tight line-clamp-2 font-medium">{filme.title}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
