import React from 'react'

interface StatCardProps {
  stat: {
    label: string;
    value: number | string;
    delta: string;
    deltaLabel: string;
  };
  Icon: React.ComponentType<{ className?: string }>;
}
function StatCard({ stat, Icon }: StatCardProps) {
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
}

export default StatCard