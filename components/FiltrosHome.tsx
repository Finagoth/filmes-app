'use client'

import { useRouter } from 'next/navigation'
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

  function aplicar(novoGenero: string, novoAno: string) {
    const params = new URLSearchParams()
    if (novoGenero) params.set('genero', novoGenero)
    if (novoAno) params.set('ano', novoAno)
    params.set('pagina', '1')
    router.push(`/?${params.toString()}`)
  }

  const temFiltro = !!(generoAtivo || anoAtivo)

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6 p-3 md:p-4 rounded-2xl border"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>

      <span className="text-sm font-medium w-full sm:w-auto" style={{ color: 'var(--text-secondary)' }}>
        🎛️ Filtrar:
      </span>

      {/* Gênero */}
      <select
        value={generoAtivo}
        onChange={e => aplicar(e.target.value, anoAtivo)}
        className="flex-1 sm:flex-none text-sm px-3 py-2 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 min-w-0"
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          borderColor: generoAtivo ? '#6366f1' : 'var(--border-color)',
        }}
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
        className="flex-1 sm:flex-none text-sm px-3 py-2 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 min-w-0"
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          borderColor: anoAtivo ? '#6366f1' : 'var(--border-color)',
        }}
      >
        <option value="">Todos os anos</option>
        {anos.map(a => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      {/* Badge filtro ativo */}
      {temFiltro && (
        <div className="flex items-center gap-2 flex-wrap">
          {generoAtivo && (
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              {generos.find(g => String(g.id) === generoAtivo)?.name}
            </span>
          )}
          {anoAtivo && (
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              {anoAtivo}
            </span>
          )}
          <button
            onClick={() => aplicar('', '')}
            className="text-xs px-3 py-1.5 rounded-xl border hover:opacity-70 transition-opacity"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            ✕ Limpar
          </button>
        </div>
      )}
    </div>
  )
}
