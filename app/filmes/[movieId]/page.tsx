import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Filme } from "@/types/tmdb";

interface Props {
  params: Promise<{ movieId: string }>;
}

async function buscarFilme(id: string): Promise<Filme> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`,
  );
  if (!res.ok) notFound();
  return res.json();
}

function formatarDuracao(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const min = minutos % 60;
  return h > 0 ? `${h}h ${min}min` : `${min}min`;
}

export default async function PaginaFilme({ params }: Props) {
  const { movieId } = await params;
  const filme = await buscarFilme(movieId);

  const urlBanner = filme.backdrop_path
    ? `https://image.tmdb.org/t/p/original${filme.backdrop_path}`
    : null;

  const urlPoster = filme.poster_path
    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
    : null;

  const ano = filme.release_date ? filme.release_date.slice(0, 4) : "N/A";
  const nota = filme.vote_average ? filme.vote_average.toFixed(1) : "N/A";
  const duracao = filme.runtime ? formatarDuracao(filme.runtime) : null;

  return (
    <main>
      {/* Banner */}
      <div className="relative w-full h-72 md:h-96 bg-gray-900">
        {urlBanner ? (
          <Image
            src={urlBanner}
            alt={filme.title}
            fill
            sizes="100vw"
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Poster ou placeholder */}
        <div className="relative w-40 h-60 md:w-52 md:h-80 flex-shrink-0 rounded-xl overflow-hidden shadow-xl -mt-20 z-10 border-4 border-white bg-gray-200">
          {urlPoster ? (
            <Image
              src={urlPoster}
              alt={`Poster de ${filme.title}`}
              fill
              sizes="208px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
              <span className="text-4xl">🎬</span>
              <span className="text-xs text-center px-2">Sem poster</span>
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-3 mt-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {filme.title}
          </h1>

          {/* Meta: ano, duração, nota */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>{ano}</span>
            {duracao && (
              <>
                <span>·</span>
                <span>{duracao}</span>
              </>
            )}
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold text-gray-700">{nota}</span>
              <span className="text-gray-400">/ 10</span>
            </span>
          </div>

          {/* Gêneros */}
          {filme.genres && filme.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filme.genres.map((genero) => (
                <span
                  key={genero.id}
                  className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-200"
                >
                  {genero.name}
                </span>
              ))}
            </div>
          )}

          {/* Sinopse */}
          {filme.overview ? (
            <p className="text-gray-700 leading-relaxed text-base mt-2 max-w-2xl">
              {filme.overview}
            </p>
          ) : (
            <p className="text-gray-400 italic">
              Sinopse não disponível em português.
            </p>
          )}

          <Link
            href="/"
            className="mt-4 self-start text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Voltar ao catálogo
          </Link>
        </div>
      </div>
    </main>
  );
}
