import { getRecentActivitiesServerSide } from '@/proxy/recent-activity/recent-activity-functions'
import React from 'react'
import RecentActivitiesList from './RecentActivitiesList';

async function RecentActivitiesLoader() {
  const response = await getRecentActivitiesServerSide();
  const payload = await response.json();
  const recentActivities = payload.data;

  return (
    <RecentActivitiesList recentActivities={recentActivities} />
  )
}

export default RecentActivitiesLoader