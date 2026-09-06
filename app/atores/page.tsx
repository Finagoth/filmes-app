import { Suspense } from 'react'
import BuscaAtores from '@/components/BuscaAtores'

export default function PaginaAtores() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Buscar atores e atrizes
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        Pesquise um nome e veja todos os filmes em que participou
      </p>
      <Suspense fallback={<div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Carregando...</div>}>
        <BuscaAtores />
      </Suspense>
    </main>
  )
}
