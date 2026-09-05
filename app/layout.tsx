import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'FilmesApp — Catálogo de filmes',
  description: 'Descubra filmes, crie suas listas e acompanhe o que assistiu',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
