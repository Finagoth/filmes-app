import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FilmesApp — Catálogo de filmes',
  description: 'Descubra filmes, crie suas listas e acompanhe o que assistiu',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link href="/" className="text-xl font-bold tracking-tight">
            🎬 FilmesApp
          </Link>
          <div className="flex items-center gap-1 text-sm flex-wrap">
            <Link href="/busca" className="px-3 py-1.5 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/10 transition-all">
              Buscar
            </Link>
            <Link href="/atores" className="px-3 py-1.5 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/10 transition-all">
              🎭 Atores
            </Link>
            <Link href="/favoritos" className="px-3 py-1.5 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/10 transition-all">
              ❤️ Favoritos
            </Link>
            <Link href="/quero-ver" className="px-3 py-1.5 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/10 transition-all">
              🔖 Quero ver
            </Link>
            <Link href="/assistidos" className="px-3 py-1.5 rounded-lg opacity-80 hover:opacity-100 hover:bg-white/10 transition-all">
              ✅ Assistidos
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
