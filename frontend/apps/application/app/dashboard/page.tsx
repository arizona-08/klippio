import React from 'react'
import UserGreetings from '../components/molecules/UserGreetings'
import Link from 'next/link'
import DashboardStats from '../components/organisms/DashboardStats/DashboardStats'


function DashboardPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <section className="relative overflow-hidden border-b border-gray-100 bg-white">
        <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-emerald-100 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-emerald-50 blur-2xl" />

        <div className="relative px-4 pt-6 pb-6 lg:px-8 lg:pt-8 lg:pb-8">
          <UserGreetings />

          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Accueil</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Bienvenue sur votre espace de travail !
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/projects"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-150 hover:border-emerald-200 hover:text-emerald-700"
              >
                Accéder à mes projets
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DashboardStats />
    </div>
  )
}

export default DashboardPage