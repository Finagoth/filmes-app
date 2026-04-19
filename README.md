# 🎬 FilmesApp

Catálogo de filmes em cartaz nos cinemas, desenvolvido com Next.js 16, TypeScript e Tailwind CSS. Os dados são consumidos em tempo real da API do [TMDB](https://www.themoviedb.org/).

## 🔗 Demo

👉 [filmes-app.vercel.app](https://filmes-app.vercel.app)

## 📸 Screenshots

> Adicione prints aqui depois (veja instruções abaixo)

## ✨ Funcionalidades

- Listagem de filmes em cartaz com poster, nota e ano
- Página de detalhes com banner, gêneros, duração e sinopse
- Busca por título com skeleton de loading
- Página 404 customizada
- Layout responsivo para mobile e desktop

## 🚀 Tecnologias

- [Next.js 16](https://nextjs.org/) — App Router, SSR e rotas dinâmicas
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [Tailwind CSS v4](https://tailwindcss.com/) — estilização utility-first
- [TMDB API](https://developer.themoviedb.org/) — dados de filmes
- [Vercel](https://vercel.com/) — deploy e hospedagem

## 🧠 O que aprendi

- Diferença entre SSR, SSG e CSR no Next.js App Router
- Como criar rotas dinâmicas com `[movieId]`
- Consumo de API REST em Server Components
- Otimização de imagens com o componente `Image` do Next.js
- Configuração de variáveis de ambiente na Vercel

## ⚙️ Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/Finagoth/filmes-app.git

# Entre na pasta
cd filmes-app

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
# Crie um arquivo .env.local na raiz com:
# NEXT_PUBLIC_TMDB_KEY=sua_chave_aqui

# Rode o projeto
npm run dev
```

Acesse `http://localhost:3000`

## 🔑 Variáveis de ambiente

| Variável               | Descrição                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_TMDB_KEY` | Chave da API do TMDB — obtenha em [themoviedb.org](https://www.themoviedb.org/settings/api) |

## 👨‍💻 Autor

**Lucas Calíope**  
[LinkedIn](https://www.linkedin.com/in/lucas-caliope09/) · [GitHub](https://github.com/Finagoth)
