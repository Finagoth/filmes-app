'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [dark, setDark] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState<'filmes' | 'atores'>('filmes')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const salvo = localStorage.getItem('dark-mode')
    if (salvo === 'true') {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggleDark() {
    const novo = !dark
    setDark(novo)
    localStorage.setItem('dark-mode', String(novo))
    document.documentElement.classList.toggle('dark', novo)
  }

  function handleBusca(e: React.FormEvent) {
    e.preventDefault()
    if (!busca.trim()) return
    if (tipoFiltro === 'atores') {
      router.push(`/atores?q=${encodeURIComponent(busca.trim())}`)
    } else {
      router.push(`/busca?q=${encodeURIComponent(busca.trim())}`)
    }
    setBusca('')
  }

  return (
    <nav className="bg-gray-900 text-white px-4 md:px-6 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-lg">
      {/* Logo */}
      <Link href="/" className="text-lg font-bold tracking-tight whitespace-nowrap mr-2">
        🎬 FilmesApp
      </Link>

      {/* Busca unificada */}
      <form onSubmit={handleBusca} className="flex flex-1 max-w-xl">
        <select
          value={tipoFiltro}
          onChange={e => setTipoFiltro(e.target.value as 'filmes' | 'atores')}
          className="bg-gray-700 text-white text-xs px-2 rounded-l-lg border-r border-gray-600 focus:outline-none cursor-pointer"
        >
          <option value="filmes">Filmes</option>
          <option value="atores">Atores</option>
        </select>
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder={tipoFiltro === 'filmes' ? 'Buscar filme...' : 'Buscar ator/atriz...'}
          className="flex-1 bg-gray-800 text-white text-sm px-4 py-2 focus:outline-none focus:bg-gray-700 transition-colors placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-r-lg text-sm transition-colors"
        >
          🔍
        </button>
      </form>

      {/* Minha Lista dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setMenuAberto(p => !p)}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          📋 Minha lista
          <span className={`text-xs transition-transform ${menuAberto ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {menuAberto && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
            <Link href="/favoritos" onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-700 transition-colors">
              ❤️ Favoritos
            </Link>
            <Link href="/quero-ver" onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-700 transition-colors border-t border-gray-700">
              🔖 Quero ver
            </Link>
            <Link href="/assistidos" onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-700 transition-colors border-t border-gray-700">
              ✅ Assistidos
            </Link>
          </div>
        )}
      </div>

      {/* Modo escuro */}
      <button
        onClick={toggleDark}
        title="Alternar modo escuro"
        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-lg"
      >
        {dark ? '☀️' : '🌙'}
      </button>
    </nav>
  )
}
