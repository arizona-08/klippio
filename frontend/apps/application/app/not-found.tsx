import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-gray-100 bg-white">
        <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-emerald-100 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-emerald-50 blur-2xl" />

        <div className="relative px-4 pt-10 pb-12 lg:px-8 lg:pt-16 lg:pb-16">
          <div className="inline-flex w-fit items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
            Page introuvable
          </div>

          <div className="mt-6 max-w-2xl">
            <h1 className="text-3xl font-semibold text-gray-900 lg:text-4xl">
              Oups, cette page n&apos;existe pas
            </h1>
            <p className="mt-3 text-sm text-gray-600 lg:text-base">
              Le lien a peut-etre ete modifie ou la page n&apos;est plus disponible.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/projects"
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-emerald-700"
            >
              Retour aux projets
            </Link>
            
          </div>
        </div>
      </section>

      <div className="px-4 pb-12 pt-10 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Besoin d&apos;aide ?</p>
              <p className="text-sm text-gray-500">
                Verifiez l&apos;adresse ou revenez a votre espace de travail.
              </p>
            </div>
            <Link
              href="/dashboard/projects"
              className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-all duration-150 hover:bg-emerald-100"
            >
              Revenir aux projets
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
