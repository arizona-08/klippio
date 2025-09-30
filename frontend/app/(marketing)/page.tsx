import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-blue-200 w-full grow-1">
      <section className="max-w-7xl mx-auto py-4">
        <h1>Main content</h1>

        <Link href="/app" className="hover:underline">Accéder à l'application&rarr;</Link>
      </section>
    </main>
  );
}
