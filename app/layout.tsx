import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FilmesApp — Catálogo de filmes em cartaz',
  description: 'Filmes em cartaz com Next.js e TMDB',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link href="/" className="text-xl font-bold tracking-tight">
            FilmesApp
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/busca" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">
              Buscar
            </Link>
            <Link href="/favoritos" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">
              ❤️ Favoritos
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
