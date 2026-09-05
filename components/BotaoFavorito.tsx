'use client'

import { useFavoritos } from '@/hooks/useFavoritos'
import { Filme } from '@/types/tmdb'

interface Props {
  filme: Filme
}

export default function BotaoFavorito({ filme }: Props) {
  const { toggleFavorito, isFavorito } = useFavoritos()
  const favoritado = isFavorito(filme.id)

  return (
    <button
      onClick={() => toggleFavorito(filme)}
      title={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
        favoritado
          ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
          : 'bg-white text-gray-700 border-gray-200 hover:border-red-400 hover:text-red-500'
      }`}
    >
      <span className="text-base">{favoritado ? '❤️' : '🤍'}</span>
      {favoritado ? 'Favoritado' : 'Favoritar'}
    </button>
  )
}
