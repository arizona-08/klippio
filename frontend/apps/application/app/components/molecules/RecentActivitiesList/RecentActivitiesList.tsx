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
      {recentActivities && recentActivities.map((item) => (
        <li key={item.id} className="flex flex-col gap-1">
          <span className="inline-block w-full whitespace-nowrap text-right text-xs text-gray-400">{formatDateRelative(item.activity.createdAt)}</span>
          <span className="text-sm text-gray-700">{item.activity.description}</span>
        </li>
      ))}
    </ul>
  )
}

export default RecentActivitiesList