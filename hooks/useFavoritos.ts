'use client'

import { useState, useEffect } from 'react'
import { Filme } from '@/types/tmdb'

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Filme[]>([])

  useEffect(() => {
    const salvos = localStorage.getItem('favoritos')
    if (salvos) setFavoritos(JSON.parse(salvos))
  }, [])

  function toggleFavorito(filme: Filme) {
    setFavoritos(prev => {
      const jaExiste = prev.some(f => f.id === filme.id)
      const novo = jaExiste
        ? prev.filter(f => f.id !== filme.id)
        : [...prev, filme]
      localStorage.setItem('favoritos', JSON.stringify(novo))
      return novo
    })
  }

  function isFavorito(id: number): boolean {
    return favoritos.some(f => f.id === id)
  }

  return { favoritos, toggleFavorito, isFavorito }
}
