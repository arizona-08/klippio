import ProjectsSectionLoader from '@/app/components/molecules/ProjectsSectionLoader'
import DisplayProjectsListSkeleton from '@/app/components/skeletons/ProjectsListSkeleton/ProjectListSkeleton'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider';
import UserGreetings from '@/app/components/molecules/UserGreetings';
import RecentActivitiesLoader from '@/app/components/molecules/RecentActivitiesList/RecentActivitiesLoader';
import RecentActivitiesSkeletonList from '@/app/components/skeletons/RecentActivitiesSkeleton/RecentActivitiesSkeletonList';

function ProjectsPage() {
  
  const recentActivities = [
    {
      label: 'Projet "Mon nouveau projet" ouvert',
      time: 'Il y a 2 h'
    },
    {
      label: 'Nouveau plan ajoute a "Deuxieme projet"',
      time: 'Hier'
    },
    {
      label: 'Invitation envoyee a Marie Dupont',
      time: 'Il y a 3 j'
    }
  ];

  return (
    <div className="Dashboard-root-container flex flex-col h-screen overflow-hidden">
      <section className="relative overflow-hidden border-b border-gray-100 bg-white">
        <div className="absolute -top-24 -right-16 h-56 w-56 rounded-full bg-emerald-100 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-40 w-40 rounded-full bg-emerald-50 blur-2xl" />

        <div className="relative px-4 pt-6 pb-6 lg:px-8 lg:pt-8 lg:pb-8">
          <UserGreetings />

          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Mes projets</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Retrouvez, organisez et partagez vos projets en un clin d'oeil.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/archives"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-150 hover:border-emerald-200 hover:text-emerald-700"
              >
                Voir les archives
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 lg:px-8 flex-1 overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] h-full ">
          <div className="min-w-0 overflow-y-auto ">
            <Suspense fallback={<DisplayProjectsListSkeleton />}>
              <ProjectsSectionLoader mode="basic" />
            </Suspense>
          </div>

          <aside className="hidden lg:block lg:border-l lg:border-gray-100 lg:pl-6">
            <div className="sticky top-4 space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <h2 className="text-sm font-semibold text-gray-900">Activite recente</h2>
                <Suspense fallback={<RecentActivitiesSkeletonList />}>
                  <RecentActivitiesLoader />
                </Suspense>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <h3 className="text-sm font-semibold text-emerald-900">Conseil rapide</h3>
                <p className="mt-2 text-sm text-emerald-800">
                  Epinglez vos projets prioritaires pour les retrouver instantanement.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage