import React from 'react'

function StatsCardSkeleton() {
  return (
    <div
      className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 w-24 h-4 bg-gray-200 animate-pulse"></p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-semibold text-gray-900 w-16 h-8 bg-gray-200 animate-pulse"></span>
            <span className="text-sm font-medium text-emerald-700 w-12 h-4 bg-gray-200 animate-pulse"></span>
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <div className="h-5 w-5 bg-gray-600 rounded-md animate-pulse"></div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full w-8 h-3 bg-gray-200 animate-bounce px-2.5 py-1 text-xs font-medium text-emerald-700"></span>
        <span className="text-xs text-gray-500 w-8 h-3 rounded-md bg-gray-200 animate-bounce"></span>
      </div>
    </div>
  )
}

export default StatsCardSkeleton