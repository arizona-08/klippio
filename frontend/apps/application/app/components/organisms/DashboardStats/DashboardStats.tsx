"use client"

import { useSidebarStore } from '@/stores/SidebarStore';
import React from 'react'
import { Camera, FileText, FolderKanban, Target } from 'lucide-react'
import { MyStatsType, RecentActivityType } from '@/types/project';
import StatCard from '../../molecules/StatCard/StatCard';
import { formatDateRelative } from '@/utils/date';


interface DashboardStatsProps {
  myStats: MyStatsType;
  recentActivities: RecentActivityType[];
}

function DashboardStats({ myStats, recentActivities }: DashboardStatsProps) {
  const isSideBarOpenAndVisible = useSidebarStore(state => state.isVisibleAndOpen);


  return (
    <section className="flex-1 min-h-0">
      <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
        <div
          className={`grid gap-6 ${
            isSideBarOpenAndVisible
              ? 'lg:grid-cols-1 xl:grid-cols-[1fr_280px]'
              : 'lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]'
          }`}
        >
          <div className="flex flex-col gap-6">
            <div
              className={`grid gap-6 ${
                isSideBarOpenAndVisible
                  ? 'md:grid-cols-2 xl:grid-cols-3'
                  : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {/* Marqueurs actifs */}
              <StatCard
                stat={{
                  label: "Marqueurs actifs",
                  value: myStats.markerStats.totalMarkers,
                  delta: `+${myStats.markerStats.markersLastWeek}`,
                  deltaLabel: 'cette semaine'
                }}
                Icon={Target}
              />

              {/* Photos ajoutées */}
              <StatCard
                stat={{
                  label: "Photos ajoutées",
                  value: myStats.photosStats.totalPhotos,
                  delta: `+${myStats.photosStats.photosLastWeek}`,
                  deltaLabel: 'cette semaine'
                }}
                Icon={Camera}
              />

              {/* Projets actifs */}   
              <StatCard
                stat={{
                  label: "Projets actifs",
                  value: myStats.projectsStats.totalProjects,
                  delta: `+${myStats.projectsStats.projectsLastWeek}`,
                  deltaLabel: 'cette semaine'
                }}
                Icon={FolderKanban}
              />

              {/* Plans consultés */}   
              <StatCard
                stat={{
                  label: "Plans consultés",
                  value: myStats.plansStats.totalPlans,
                  delta: `+${myStats.plansStats.plansLastWeek}`,
                  deltaLabel: 'cette semaine'
                }}
                Icon={FileText}
              />
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Quick resume</h3>
                  <p className="mt-1 text-xs text-gray-500">Derniers plans consultes</p>
                </div>
                <button className="text-xs font-medium text-emerald-700 hover:text-emerald-800">Voir tout</button>
              </div>

              <div className="mt-4 space-y-3">
                {['Plan Elec - RDC', 'Facade Nord', 'Plan Elec - R+1', 'Facade Sud'].map((title) => (
                  <div key={title} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{title}</p>
                      <p className="text-xs text-gray-500">Tour Alpha</p>
                    </div>
                    <span className="text-xs text-gray-400">12 min</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Recent activity</h3>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Live</span>
            </div>

            <div className="mt-4 space-y-4">
              {recentActivities.map((activityItem) => (
                <div key={activityItem.id} className="flex gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activityItem.activity.description}</p>
                    <p className="text-xs text-gray-500">{formatDateRelative(activityItem.activity.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default DashboardStats