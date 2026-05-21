import React from 'react'

function QuickResumeSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 w-32 h-4 bg-gray-200 animate-pulse"></h3>
          <p className="mt-1 text-xs text-gray-500 w-24 h-3 bg-gray-200 animate-pulse"></p>
        </div>
        <button className="text-xs font-medium text-emerald-700 hover:text-emerald-800 w-16 h-4 bg-gray-200 animate-pulse"></button>
      </div>

      <div className="mt-4 space-y-3">
        {Array.from({length: 3}).map((_, index) => (
          <div className="flex items-center justify-between rounded-xl border border-gray-100 p-3 hover:bg-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900 w-24 h-4 bg-gray-200 animate-pulse"></p>
              <p className="text-xs text-gray-500 w-20 h-3 bg-gray-200 animate-pulse"></p>
            </div>
            <span className="text-xs text-gray-400 w-16 h-3 bg-gray-200 animate-pulse"></span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuickResumeSkeleton