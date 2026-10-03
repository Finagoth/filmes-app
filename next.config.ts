import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Desabilita otimização de imagem do servidor para evitar estourar
    // limites de Image Optimization na Vercel/Netlify (plano gratuito)
    // As imagens do TMDB já vêm otimizadas diretamente da CDN deles
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
    ],
  },
}

export default nextConfig
