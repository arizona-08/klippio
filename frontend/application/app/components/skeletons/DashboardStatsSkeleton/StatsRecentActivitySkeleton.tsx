import React from 'react'

function StatsRecentActivitySkeleton() {
  return (
    <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 w-24 h-4 bg-gray-200 animate-pulse"></h3>
        <span className="rounded-full px-2.5 py-1 text-xs font-medium text-emerald-700 w-12 h-4 bg-gray-200 animate-pulse"></span>
      </div>

      <div className="mt-4 space-y-4">
        {Array.from({length: 5}).map((_, index) => (
          <div key={index} className="flex gap-3">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 w-32 h-4 bg-gray-200 animate-pulse"></p>
              <p className="text-xs text-gray-500 w-16 h-3 bg-gray-200 animate-pulse"></p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default StatsRecentActivitySkeleton