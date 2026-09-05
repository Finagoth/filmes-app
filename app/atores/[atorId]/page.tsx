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
  return {
    title: `${ator.name} | FilmesApp`,
    description: `Filmografia de ${ator.name}`,
  }
}

export default async function PaginaAtor({ params }: Props) {
  const { atorId } = await params
  const [ator, filmes] = await Promise.all([
    buscarAtor(atorId),
    buscarFilmografia(atorId),
  ])

  const urlFoto = ator.profile_path
    ? `https://image.tmdb.org/t/p/w500${ator.profile_path}`
    : null

  const idade = ator.birthday
    ? Math.floor((new Date().getTime() - new Date(ator.birthday).getTime()) / 3.15576e10)
    : null

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* Perfil */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="relative w-40 h-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg bg-gray-200">
          {urlFoto ? (
            <Image src={urlFoto} alt={ator.name} fill sizes="160px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">👤</div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">{ator.name}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {ator.known_for_department && (
              <span className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                {ator.known_for_department === 'Acting' ? 'Ator / Atriz' : ator.known_for_department}
              </span>
            )}
            {ator.birthday && (
              <span>🎂 {new Date(ator.birthday).toLocaleDateString('pt-BR')}{idade ? ` (${idade} anos)` : ''}</span>
            )}
            {ator.place_of_birth && <span>📍 {ator.place_of_birth}</span>}
          </div>

          {ator.biography && (
            <p className="text-gray-600 text-sm leading-relaxed mt-2 max-w-2xl line-clamp-5">
              {ator.biography}
            </p>
          )}

          <Link href="/atores" className="self-start text-sm text-blue-600 hover:underline mt-2">
            ← Voltar à busca
          </Link>
        </div>
      </div>

      {/* Filmografia */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Filmografia</h2>
      {filmes.length === 0 ? (
        <p className="text-gray-400">Nenhum filme encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filmes.map((filme: any) => (
            <Link key={filme.id} href={`/filmes/${filme.id}`} className="group block">
              <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="relative aspect-[2/3] bg-gray-200">
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${filme.poster_path}`}
                    alt={filme.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {filme.vote_average > 0 && (
                    <div className="absolute top-1.5 right-1.5 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      ★ {filme.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight">{filme.title}</p>
                  {filme.character && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">como {filme.character}</p>
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
