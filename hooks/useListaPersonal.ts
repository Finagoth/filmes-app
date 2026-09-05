'use client'

import { useState, useEffect } from 'react'
import { Filme, AvaliacaoUsuario } from '@/types/tmdb'

export function useQueroVer() {
  const [lista, setLista] = useState<Filme[]>([])

  useEffect(() => {
    const salvos = localStorage.getItem('quero-ver')
    if (salvos) setLista(JSON.parse(salvos))
  }, [])

  function toggle(filme: Filme) {
    setLista(prev => {
      const jaExiste = prev.some(f => f.id === filme.id)
      const novo = jaExiste ? prev.filter(f => f.id !== filme.id) : [...prev, filme]
      localStorage.setItem('quero-ver', JSON.stringify(novo))
      return novo
    })
  }

  function esta(id: number) {
    return lista.some(f => f.id === id)
  }

  return { lista, toggle, esta }
}

export function useAssistidos() {
  const [assistidos, setAssistidos] = useState<Record<number, AvaliacaoUsuario & { filme: Filme }>>({})

  useEffect(() => {
    const salvos = localStorage.getItem('assistidos')
    if (salvos) setAssistidos(JSON.parse(salvos))
  }, [])

  function salvar(filme: Filme, avaliacao: AvaliacaoUsuario) {
    setAssistidos(prev => {
      const novo = { ...prev, [filme.id]: { ...avaliacao, filme } }
      localStorage.setItem('assistidos', JSON.stringify(novo))
      return novo
    })
  }

  function remover(id: number) {
    setAssistidos(prev => {
      const novo = { ...prev }
      delete novo[id]
      localStorage.setItem('assistidos', JSON.stringify(novo))
      return novo
    })
  }

  function getAvaliacao(id: number) {
    return assistidos[id] || null
  }

  function foiAssistido(id: number) {
    return id in assistidos
  }

  return { assistidos, salvar, remover, getAvaliacao, foiAssistido }
}
