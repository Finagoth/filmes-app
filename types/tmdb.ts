export interface Genero {
  id: number
  name: string
}

export interface Filme {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  backdrop_path: string | null
  genres?: Genero[]
  runtime?: number
}

export interface RespostaTMDB {
  results: Filme[]
  total_pages: number
  total_results: number
}

export interface Ator {
  id: number
  name: string
  profile_path: string | null
  known_for_department: string
  popularity: number
}

export interface RespostaPessoas {
  results: Ator[]
  total_pages: number
  total_results: number
}

export interface FilmeCredito {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  character: string
}

export interface RespostaCreditos {
  cast: FilmeCredito[]
}

export interface AvaliacaoUsuario {
  nota: number
  opiniao: string
  data: string
}
