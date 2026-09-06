import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ atorId: string }>
}

async function buscarAtor(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`
  )
  if (!res.ok) notFound()
  return res.json()
}

async function buscarFilmografia(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`
  )
  if (!res.ok) return []
  const dados = await res.json()
  return dados.cast
    .filter((f: any) => f.poster_path)
    .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 18)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { atorId } = await params
  const ator = await buscarAtor(atorId)
  return { title: `${ator.name} | FilmesApp`, description: `Filmografia de ${ator.name}` }
}

export default async function PaginaAtor({ params }: Props) {
  const { atorId } = await params
  const [ator, filmes] = await Promise.all([buscarAtor(atorId), buscarFilmografia(atorId)])

  const urlFoto = ator.profile_path
    ? `https://image.tmdb.org/t/p/w500${ator.profile_path}`
    : null

  const idade = ator.birthday
    ? Math.floor((Date.now() - new Date(ator.birthday).getTime()) / 3.15576e10)
    : null

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      {/* Perfil */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        <div className="relative w-36 h-52 sm:w-40 sm:h-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg bg-gray-200 mx-auto sm:mx-0">
          {urlFoto ? (
            <Image src={urlFoto} alt={ator.name} fill sizes="160px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">👤</div>
          )}
        </div>

        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {ator.name}
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {ator.known_for_department && (
              <span className="px-3 py-1 rounded-full border text-xs"
                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                {ator.known_for_department === 'Acting' ? 'Ator / Atriz' : ator.known_for_department}
              </span>
            )}
            {ator.birthday && (
              <span>🎂 {new Date(ator.birthday).toLocaleDateString('pt-BR')}{idade ? ` (${idade} anos)` : ''}</span>
            )}
            {ator.place_of_birth && <span className="hidden md:inline">📍 {ator.place_of_birth}</span>}
          </div>
          {ator.biography && (
            <p className="text-sm leading-relaxed mt-1 max-w-2xl line-clamp-4 sm:line-clamp-5" style={{ color: 'var(--text-secondary)' }}>
              {ator.biography}
            </p>
          )}
          <Link href="/atores" className="self-center sm:self-start text-sm text-blue-500 hover:underline mt-1">
            ← Voltar à busca
          </Link>
        </div>
      </div>

      {/* Filmografia — cards com altura uniforme via grid + flex */}
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Filmografia</h2>
      {filmes.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>Nenhum filme encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 items-start">
          {filmes.map((filme: any) => (
            <Link key={filme.id} href={`/filmes/${filme.id}`} className="group block">
              {/* Card com flex-col e altura mínima fixa no rodapé */}
              <div className="rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>

                {/* Poster — aspect-ratio fixo garante mesma altura */}
                <div className="relative w-full aspect-[2/3] bg-gray-200 flex-shrink-0">
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${filme.poster_path}`}
                    alt={filme.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {filme.vote_average > 0 && (
                    <div className="absolute top-1.5 right-1.5 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      ★ {filme.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Info — altura fixa para alinhar todas as caixas */}
                <div className="p-2 flex flex-col gap-0.5" style={{ minHeight: '58px' }}>
                  <p className="text-xs font-semibold line-clamp-2 leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {filme.title}
                  </p>
                  {filme.character && (
                    <p className="text-xs line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                      como {filme.character}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
