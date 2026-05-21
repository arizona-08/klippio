import React, { Suspense } from 'react'
import DashboardStats from './DashboardStats'
import { getMyStatsServerSide } from '@/proxy/stats/stats-functions';
import { getRecentActivitiesServerSide } from '@/proxy/recent-activity/recent-activity-functions';
import { MyStatsType, RecentActivityType } from '@/types/project';

async function DashboardStatsLoader() {
  const response = await getMyStatsServerSide();
  const data: MyStatsType = await response.json();

  const recentActivityResponse = await getRecentActivitiesServerSide();
  const recentActivity = await recentActivityResponse.json();
  const recentActivitiesData: RecentActivityType[] = recentActivity.data;

  return (
    <Suspense fallback={<div>loading...</div>}>
      <DashboardStats myStats={data} recentActivities={recentActivitiesData}/>
    </Suspense>
  )
}

export default DashboardStatsLoader