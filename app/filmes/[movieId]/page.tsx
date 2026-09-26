import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Filme } from '@/types/tmdb'
import BotoesListas from '@/components/BotoesListas'
import FilmesSimilares from '@/components/FilmesSimilares'
import ElencoFilme from '@/components/ElencoFilme'
import TrailerFilme from '@/components/TrailerFilme'

interface Props {
  params: Promise<{ movieId: string }>
}

async function buscarFilme(id: string): Promise<Filme> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`
  )
  if (!res.ok) notFound()
  return res.json()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { movieId } = await params
  const filme = await buscarFilme(movieId)
  return {
    title: `${filme.title} | FilmesApp`,
    description: filme.overview || `Detalhes sobre ${filme.title}`,
    openGraph: {
      title: filme.title,
      description: filme.overview,
      images: filme.backdrop_path
        ? [`https://image.tmdb.org/t/p/w1280${filme.backdrop_path}`]
        : [],
    },
  }
}

function formatarDuracao(minutos: number): string {
  const h = Math.floor(minutos / 60)
  const min = minutos % 60
  return h > 0 ? `${h}h ${min}min` : `${min}min`
}

export default async function PaginaFilme({ params }: Props) {
  const { movieId } = await params
  const filme = await buscarFilme(movieId)

  const urlBanner = filme.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${filme.backdrop_path}`
    : null
  const urlPoster = filme.poster_path
    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
    : null

  const ano = filme.release_date ? filme.release_date.slice(0, 4) : 'N/A'
  const nota = filme.vote_average ? filme.vote_average.toFixed(1) : 'N/A'
  const duracao = filme.runtime ? formatarDuracao(filme.runtime) : null

  return (
    <main>
      {/* ── Banner ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(200px, 35vw, 420px)', backgroundColor: 'var(--nav-bg)' }}
      >
        {urlBanner ? (
          <Image
            src={urlBanner}
            alt={filme.title}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-60"
          />
        ) : (
          /* Gradiente genérico quando não há banner */
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
          />
        )}
        {/* Gradiente de fade para o conteúdo abaixo */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 60%)' }}
        />
      </div>

      {/* ── Conteúdo principal ── */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pb-8">
        <div className="flex flex-col sm:flex-row gap-6 -mt-20 sm:-mt-28 relative z-10">

          {/* Poster */}
          <div
            className="flex-shrink-0 mx-auto sm:mx-0 rounded-xl overflow-hidden shadow-2xl border-4"
            style={{
              width: 'clamp(120px, 22vw, 200px)',
              aspectRatio: '2/3',
              backgroundColor: 'var(--img-bg)',
              borderColor: 'var(--bg-card)',
              position: 'relative',
            }}
          >
            {urlPoster ? (
              <Image
                src={urlPoster}
                alt={`Poster de ${filme.title}`}
                fill
                sizes="200px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-40">
                <span className="text-5xl">🎬</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sem poster</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 pt-2 sm:pt-20 text-center sm:text-left">
            <h1
              className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {filme.title}
            </h1>

            {/* Meta */}
            <div
              className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>{ano}</span>
              {duracao && <><span>·</span><span>{duracao}</span></>}
              <span>·</span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{nota}</span>
                <span style={{ color: 'var(--text-secondary)' }}>/10</span>
              </span>
            </div>

            {/* Gêneros */}
            {filme.genres && filme.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {filme.genres.map(g => (
                  <span
                    key={g.id}
                    className="text-xs font-medium px-3 py-1 rounded-full border"
                    style={{
                      borderColor: 'var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Sinopse */}
            {filme.overview ? (
              <p
                className="text-sm md:text-base leading-relaxed max-w-2xl"
                style={{ color: 'var(--text-secondary)' }}
              >
                {filme.overview}
              </p>
            ) : (
              <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                Sinopse não disponível em português.
              </p>
            )}

            {/* Botões de lista */}
            <BotoesListas filme={filme} />

            <Link
              href="/"
              className="self-center sm:self-start flex items-center gap-1 px-4 py-2 rounded-xl text-sm border transition-colors mt-1"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              ← Voltar ao catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* ── Seções abaixo ── */}
      <TrailerFilme filmeId={Number(movieId)} titulo={filme.title} />
      <ElencoFilme filmeId={Number(movieId)} />
      <FilmesSimilares filmeId={Number(movieId)} />
    </main>
  )
}
