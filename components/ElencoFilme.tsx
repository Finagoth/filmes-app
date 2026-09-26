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
  } catch { return [] }
}

export default async function ElencoFilme({ filmeId }: Props) {
  const elenco = await buscarElenco(filmeId)
  if (elenco.length === 0) return null

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 pb-8">
      <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Elenco principal
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {elenco.map((ator: any) => {
          const urlFoto = ator.profile_path
            ? `https://image.tmdb.org/t/p/w185${ator.profile_path}`
            : null

          return (
            <Link key={ator.id} href={`/atores/${ator.id}`} className="group block text-center">
              {/* Foto circular */}
              <div
                className="relative mx-auto rounded-full overflow-hidden border-2 border-transparent group-hover:border-gray-400 transition-all mb-1.5"
                style={{
                  width: 'clamp(48px, 10vw, 64px)',
                  height: 'clamp(48px, 10vw, 64px)',
                  backgroundColor: 'var(--img-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {urlFoto ? (
                  <Image
                    src={urlFoto}
                    alt={ator.name}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl opacity-40">
                    👤
                  </div>
                )}
              </div>
              <p className="text-xs font-medium line-clamp-1 leading-tight" style={{ color: 'var(--text-primary)' }}>
                {ator.name}
              </p>
              {ator.character && (
                <p className="text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {ator.character}
                </p>
              )}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
