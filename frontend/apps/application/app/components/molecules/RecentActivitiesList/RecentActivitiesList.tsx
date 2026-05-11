import { formatDateRelative } from '@/utils/date';
import React from 'react'

interface RecentActivitiesListProps {
  recentActivities: {
    id: string;
    userId: number;
    activityId: string;
    activity: {
      description: string;
      createdAt: string;
    }
  }[]
}


function RecentActivitiesList({ recentActivities }: RecentActivitiesListProps) {
  return (
    <ul className="mt-3 space-y-3">
      {recentActivities && recentActivities.map((item, index) => (
        <li key={index} className="flex items-start justify-between gap-3">
          <span className="text-sm text-gray-700">{item.activity.description}</span>
          <span className="whitespace-nowrap text-xs text-gray-400">{formatDateRelative(item.activity.createdAt)}</span>
        </li>
      ))}
    </ul>
  )
}

export default RecentActivitiesList