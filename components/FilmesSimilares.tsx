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
    return dados.results.filter(f => f.poster_path).slice(0, 6)
  } catch { return [] }
}

export default async function FilmesSimilares({ filmeId }: Props) {
  const similares = await buscarSimilares(filmeId)
  if (similares.length === 0) return null

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 pb-12">
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Você também pode gostar
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {similares.map(filme => (
          <Link key={filme.id} href={`/filmes/${filme.id}`} className="group block">
            <div
              className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div
                className="relative w-full flex-shrink-0"
                style={{ aspectRatio: '2/3', backgroundColor: 'var(--img-bg)' }}
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w300${filme.poster_path}`}
                  alt={filme.title}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-1.5" style={{ minHeight: '40px' }}>
                <p
                  className="text-xs font-medium line-clamp-2 leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {filme.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
