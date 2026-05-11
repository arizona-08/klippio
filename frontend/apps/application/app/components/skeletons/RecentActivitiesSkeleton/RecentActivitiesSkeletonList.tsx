import React from 'react'

function RecentActivitiesSkeletonList() {
  return (
    <ul className="mt-3 space-y-3">
      {[...Array(3)].map((_, index) => (
        <li key={index} className="flex items-start justify-between gap-3">
          <span className="inline-block text-sm bg-gray-600 h-4 w-3/4 rounded  animate-pulse"></span>
          <span className="inline-block bg-gray-400 h-3 w-1/4 rounded animate-pulse"></span>
        </li>
      ))}
    </ul>
  )
}

export default RecentActivitiesSkeletonList