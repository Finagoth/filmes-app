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