'use client'

import { useState } from 'react'
import { Filme, AvaliacaoUsuario } from '@/types/tmdb'

interface Props {
  filme: Filme
  avaliacaoAtual?: AvaliacaoUsuario | null
  onSalvar: (avaliacao: AvaliacaoUsuario) => void
  onFechar: () => void
}

export default function ModalAvaliacao({ filme, avaliacaoAtual, onSalvar, onFechar }: Props) {
  const [nota, setNota] = useState(avaliacaoAtual?.nota ?? 0)
  const [opiniao, setOpiniao] = useState(avaliacaoAtual?.opiniao ?? '')

  function handleSalvar() {
    if (nota === 0) return
    onSalvar({ nota, opiniao, data: new Date().toLocaleDateString('pt-BR') })
    onFechar()
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onFechar}>
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-1">Avaliar filme</h2>
        <p className="text-gray-500 text-sm mb-5">{filme.title}</p>

        {/* Estrelas */}
        <p className="text-sm font-medium text-gray-700 mb-2">Sua nota</p>
        <div className="flex gap-1 mb-5">
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button
              key={n}
              onClick={() => setNota(n)}
              className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                n <= nota
                  ? 'bg-yellow-400 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-yellow-100'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Opinião */}
        <p className="text-sm font-medium text-gray-700 mb-2">Sua opinião <span className="text-gray-400 font-normal">(opcional)</span></p>
        <textarea
          value={opiniao}
          onChange={e => setOpiniao(e.target.value)}
          placeholder="O que achou do filme?"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 mb-5"
        />

        <div className="flex gap-3">
          <button
            onClick={onFechar}
            className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={nota === 0}
            className="flex-1 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
