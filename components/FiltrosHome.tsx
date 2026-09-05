'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Genero } from '@/types/tmdb'

interface Props {
  generos: Genero[]
  anos: string[]
  generoAtivo: string
  anoAtivo: string
  paginaAtiva: number
}

export default function FiltrosHome({ generos, anos, generoAtivo, anoAtivo }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function aplicar(novoGenero: string, novoAno: string) {
    const params = new URLSearchParams()
    if (novoGenero) params.set('genero', novoGenero)
    if (novoAno) params.set('ano', novoAno)
    params.set('pagina', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Filtrar:</span>

      {/* Gênero */}
      <select
        value={generoAtivo}
        onChange={e => aplicar(e.target.value, anoAtivo)}
        className="text-sm px-3 py-2 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
      >
        <option value="">Todos os gêneros</option>
        {generos.map(g => (
          <option key={g.id} value={String(g.id)}>{g.name}</option>
        ))}
      </select>

      {/* Ano */}
      <select
        value={anoAtivo}
        onChange={e => aplicar(generoAtivo, e.target.value)}
        className="text-sm px-3 py-2 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900"
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
      >
        <option value="">Todos os anos</option>
        {anos.map(a => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      {/* Limpar */}
      {(generoAtivo || anoAtivo) && (
        <button
          onClick={() => aplicar('', '')}
          className="text-sm px-3 py-2 rounded-xl border hover:opacity-80 transition-opacity"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
        >
          ✕ Limpar filtros
        </button>
      )}
    </div>
  )
}
