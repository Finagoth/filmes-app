import { RespostaTMDB, Filme } from "@/types/tmdb";
import CardFilme from "@/components/CardFilme";

async function buscarFilmes(): Promise<Filme[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}&language=pt-BR`,
    { next: { revalidate: 3600 } },
  );
  const dados: RespostaTMDB = await res.json();
  return dados.results;
}

export default async function Home() {
  const filmes = await buscarFilmes();

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Em cartaz</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Filmes atualmente nos cinemas
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {filmes.map((filme) => (
          <CardFilme key={filme.id} filme={filme} />
        ))}
      </div>
    </main>
  );
}
