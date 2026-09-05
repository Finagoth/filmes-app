'use client'

import { useQueroVer } from '@/hooks/useListaPersonal'
import CardFilme from '@/components/CardFilme'
import Link from 'next/link'

export default function PaginaQueroVer() {
  const { lista } = useQueroVer()

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Quero ver</h1>
      <p className="text-gray-500 mb-8 text-sm">
        {lista.length} filme{lista.length !== 1 ? 's' : ''} na lista
      </p>

      {lista.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-5xl mb-4">🔖</p>
          <p className="text-gray-500 text-lg">Nenhum filme na lista ainda</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">Clique em "Quero ver" na página de um filme</p>
          <Link href="/" className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm hover:bg-gray-700 transition-colors">
            Ver filmes em cartaz
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {lista.map(filme => <CardFilme key={filme.id} filme={filme} />)}
        </div>
      )}
    </main>
  )
}
