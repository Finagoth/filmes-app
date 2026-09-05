'use client'

import { useState } from 'react'
import { Filme } from '@/types/tmdb'
import { useFavoritos } from '@/hooks/useFavoritos'
import { useQueroVer, useAssistidos } from '@/hooks/useListaPersonal'
import ModalAvaliacao from './ModalAvaliacao'

interface Props {
  filme: Filme
}

export default function BotoesListas({ filme }: Props) {
  const { toggleFavorito, isFavorito } = useFavoritos()
  const { toggle: toggleQueroVer, esta: estaQueroVer } = useQueroVer()
  const { salvar, remover, getAvaliacao, foiAssistido } = useAssistidos()
  const [modalAberto, setModalAberto] = useState(false)

  const favoritado = isFavorito(filme.id)
  const naLista = estaQueroVer(filme.id)
  const assistido = foiAssistido(filme.id)
  const avaliacao = getAvaliacao(filme.id)

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {/* Favoritar */}
        <button
          onClick={() => toggleFavorito(filme)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            favoritado
              ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-red-400 hover:text-red-500'
          }`}
        >
          {favoritado ? '❤️ Favoritado' : '🤍 Favoritar'}
        </button>

        {/* Quero Ver */}
        <button
          onClick={() => toggleQueroVer(filme)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            naLista
              ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-500'
          }`}
        >
          {naLista ? '🔖 Na lista' : '+ Quero ver'}
        </button>

        {/* Já Assistido */}
        <button
          onClick={() => assistido ? remover(filme.id) : setModalAberto(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            assistido
              ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
              : 'bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:text-green-600'
          }`}
        >
          {assistido ? `✅ Assistido · ${avaliacao?.nota}/10` : '✓ Já assisti'}
        </button>

        {/* Editar avaliação */}
        {assistido && (
          <button
            onClick={() => setModalAberto(true)}
            className="px-3 py-2 rounded-xl text-sm border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors bg-white"
          >
            ✏️
          </button>
        )}
      </div>

      {/* Opinião salva */}
      {assistido && avaliacao?.opiniao && (
        <div className="mt-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3 max-w-2xl">
          <p className="text-xs text-green-600 font-medium mb-1">Sua opinião · {avaliacao.data}</p>
          <p className="text-sm text-gray-700 italic">"{avaliacao.opiniao}"</p>
        </div>
      )}

      {modalAberto && (
        <ModalAvaliacao
          filme={filme}
          avaliacaoAtual={avaliacao}
          onSalvar={av => salvar(filme, av)}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </>
  )
}
