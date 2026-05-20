"use client"

import { useSidebarStore } from '@/stores/SidebarStore';
import React from 'react'
import { Camera, FileText, FolderKanban, Target } from 'lucide-react'

function DashboardStats() {
  const isSideBarOpenAndVisible = useSidebarStore(state => state.isVisibleAndOpen);

  const stats = [
    {
      label: 'Marqueurs actifs',
      value: '24',
      delta: '+5',
      deltaLabel: 'cette semaine',
      icon: Target
    },
    {
      label: 'Photos ajoutees',
      value: '128',
      delta: '+15',
      deltaLabel: 'cette semaine',
      icon: Camera
    },
    {
      label: 'Projets actifs',
      value: '7',
      delta: '+1',
      deltaLabel: 'ce mois',
      icon: FolderKanban
    },
    {
      label: 'Plans consultes',
      value: '52',
      delta: '+8',
      deltaLabel: 'cette semaine',
      icon: FileText
    }
  ]

  const recentActivities = [
    {
      label: 'Photo ajoutee par Jean D.',
      detail: 'Horizon Residence',
      time: '10 min'
    },
    {
      label: 'Nouveau plan "HVAC R3" ajoute',
      detail: 'Tour Alpha',
      time: '35 min'
    },
    {
      label: 'Marqueur #24 cloture',
      detail: 'Projet Batiment C',
      time: '1 h'
    }
  ]

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
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-3xl font-semibold text-gray-900">{stat.value}</span>
                          <span className="text-sm font-medium text-emerald-700">{stat.delta}</span>
                        </div>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        {stat.deltaLabel}
                      </span>
                      <span className="text-xs text-gray-500">vs derniere periode</span>
                    </div>
                  </div>
                )
              })}
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
              {recentActivities.map((activity) => (
                <div key={activity.label} className="flex gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.label}</p>
                    <p className="text-xs text-gray-500">{activity.detail} · {activity.time}</p>
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