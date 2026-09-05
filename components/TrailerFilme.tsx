interface Props {
  filmeId: number
  titulo: string
}

async function buscarTrailer(id: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`
    )
    if (!res.ok) return null
    const dados = await res.json()

    // Tenta trailer em PT primeiro, depois EN
    let video = dados.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
    if (!video) {
      const resEn = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=en-US`
      )
      const dadosEn = await resEn.json()
      video = dadosEn.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
    }

    return video?.key || null
  } catch {
    return null
  }
}

export default async function TrailerFilme({ filmeId, titulo }: Props) {
  const trailerKey = await buscarTrailer(filmeId)
  if (!trailerKey) return null

  return (
    <section className="max-w-4xl mx-auto px-6 pb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Trailer</h2>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title={`Trailer de ${titulo}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </section>
  )
}
