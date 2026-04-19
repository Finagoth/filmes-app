import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-gray-500">Página não encontrada</p>
      <Link href="/" className="text-blue-600 hover:underline">
        Voltar ao início
      </Link>
    </main>
  );
}
