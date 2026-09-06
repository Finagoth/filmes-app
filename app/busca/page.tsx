import { Suspense } from 'react'
import BuscaFilmes from '@/components/BuscaFilmes'

export default function PaginaBusca() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Buscar filmes</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Encontre qualquer filme pelo título</p>
      <Suspense fallback={<div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Carregando...</div>}>
        <BuscaFilmes />
      </Suspense>
    </main>
  )
}
