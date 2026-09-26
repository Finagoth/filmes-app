import Image from 'next/image'
import Link from 'next/link'
import { Filme } from '@/types/tmdb'

interface Props {
  filme: Filme
}

export default function CardFilme({ filme }: Props) {
  const urlPoster = filme.poster_path
    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
    : null

  const ano = filme.release_date ? filme.release_date.slice(0, 4) : 'N/A'
  const nota = filme.vote_average ? filme.vote_average.toFixed(1) : 'N/A'

  return (
    <Link href={`/filmes/${filme.id}`} className="group block">
      <div
        className="rounded-xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        {/* Poster com placeholder sempre visível */}
        <div
          className="relative w-full flex-shrink-0"
          style={{ aspectRatio: '2/3', backgroundColor: 'var(--img-bg)' }}
        >
          {urlPoster ? (
            <Image
              src={urlPoster}
              alt={filme.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : null}

          {/* Placeholder quando não tem imagem */}
          {!urlPoster && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <span className="text-3xl opacity-30">🎬</span>
              <span className="text-xs opacity-30" style={{ color: 'var(--text-secondary)' }}>
                Sem imagem
              </span>
            </div>
          )}

          {/* Badge nota */}
          <div className="absolute top-2 right-2 bg-black/75 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 backdrop-blur-sm">
            <span className="text-yellow-400">★</span>
            {nota}
          </div>
        </div>

        {/* Info — altura mínima fixa para alinhar grid */}
        <div className="p-3 flex flex-col justify-between" style={{ minHeight: '68px' }}>
          <h2
            className="font-semibold text-sm leading-tight line-clamp-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {filme.title}
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            {ano}
          </p>
        </div>
      </div>
    </Link>
  )
}
