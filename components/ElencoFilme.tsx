import Image from 'next/image'
import Link from 'next/link'

interface Props {
  filmeId: number
}

async function buscarElenco(id: number) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`
    )
    if (!res.ok) return []
    const dados = await res.json()
    return dados.cast.slice(0, 8)
  } catch {
    return []
  }
}

export default async function ElencoFilme({ filmeId }: Props) {
  const elenco = await buscarElenco(filmeId)
  if (elenco.length === 0) return null

  return (
    <section className="max-w-4xl mx-auto px-6 pb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Elenco principal</h2>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {elenco.map((ator: any) => {
          const urlFoto = ator.profile_path
            ? `https://image.tmdb.org/t/p/w185${ator.profile_path}`
            : null
          return (
            <Link key={ator.id} href={`/atores/${ator.id}`} className="group block text-center">
              <div className="relative aspect-square rounded-full overflow-hidden bg-gray-200 mb-1 mx-auto w-14 h-14 md:w-16 md:h-16 border-2 border-white shadow group-hover:border-gray-400 transition-all">
                {urlFoto ? (
                  <Image
                    src={urlFoto}
                    alt={ator.name}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">👤</div>
                )}
              </div>
              <p className="text-xs text-gray-700 font-medium line-clamp-1 leading-tight">{ator.name}</p>
              <p className="text-xs text-gray-400 line-clamp-1">{ator.character}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
