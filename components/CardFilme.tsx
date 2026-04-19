import Image from "next/image";
import Link from "next/link";
import { Filme } from "@/types/tmdb";

interface Props {
  filme: Filme;
}

export default function CardFilme({ filme }: Props) {
  const urlPoster = filme.poster_path
    ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
    : null;

  const ano = filme.release_date ? filme.release_date.slice(0, 4) : "N/A";
  const nota = filme.vote_average ? filme.vote_average.toFixed(1) : "N/A";

  return (
    <Link href={`/filmes/${filme.id}`} className="group block">
      <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Poster */}
        <div className="relative w-full aspect-[2/3] bg-gray-200">
          {urlPoster ? (
            <Image
              src={urlPoster}
              alt={filme.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Sem imagem
            </div>
          )}
          {/* Badge de nota */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            {nota}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h2 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
            {filme.title}
          </h2>
          <p className="text-xs text-gray-400 mt-1">{ano}</p>
        </div>
      </div>
    </Link>
  );
}
