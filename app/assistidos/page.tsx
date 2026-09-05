'use client'

import { useAssistidos } from '@/hooks/useListaPersonal'
import Image from 'next/image'
import Link from 'next/link'

export default function PaginaAssistidos() {
  const { assistidos, remover } = useAssistidos()
  const lista = Object.values(assistidos)

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Já assistidos</h1>
      <p className="text-gray-500 mb-8 text-sm">
        {lista.length} filme{lista.length !== 1 ? 's' : ''} assistidos
      </p>

      {lista.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-gray-500 text-lg">Nenhum filme marcado como assistido</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">Clique em "Já assisti" na página de um filme</p>
          <Link href="/" className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm hover:bg-gray-700 transition-colors">
            Ver filmes em cartaz
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {lista.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).map(item => {
            const urlPoster = item.filme.poster_path
              ? `https://image.tmdb.org/t/p/w200${item.filme.poster_path}`
              : null
            return (
              <div key={item.filme.id} className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <Link href={`/filmes/${item.filme.id}`} className="flex-shrink-0">
                  <div className="relative w-16 h-24 rounded-lg overflow-hidden bg-gray-100">
                    {urlPoster ? (
                      <Image src={urlPoster} alt={item.filme.title} fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">🎬</div>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/filmes/${item.filme.id}`}>
                        <h2 className="font-semibold text-gray-900 hover:underline leading-tight">{item.filme.title}</h2>
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">{item.data}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full flex-shrink-0">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="font-bold text-gray-800 text-sm">{item.nota}</span>
                      <span className="text-gray-400 text-xs">/10</span>
                    </div>
                  </div>

                  {item.opiniao && (
                    <p className="text-sm text-gray-600 italic mt-2 line-clamp-2">"{item.opiniao}"</p>
                  )}
                </div>

                <button
                  onClick={() => remover(item.filme.id)}
                  className="self-start text-gray-300 hover:text-red-400 transition-colors text-lg flex-shrink-0"
                  title="Remover"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
