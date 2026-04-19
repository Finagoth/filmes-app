import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Catálogo de Filmes",
  description: "Filmes em cartaz com Next.js e TMDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link href="/" className="text-xl font-bold tracking-tight">
            FilmesApp
          </Link>
          <Link
            href="/busca"
            className="text-sm hover:underline opacity-80 hover:opacity-100"
          >
            Buscar
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
