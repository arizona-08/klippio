import React, { Suspense } from 'react'
import DashboardStats from './DashboardStats'
import { getMyStatsServerSide, getThreeLastOpenedPlans } from '@/proxy/stats/stats-functions';
import { getRecentActivitiesServerSide } from '@/proxy/recent-activity/recent-activity-functions';
import { LastProjectOpenedType, MyStatsType, RecentActivityType } from '@/types/project';

async function DashboardStatsLoader() {
  const response = await getMyStatsServerSide();
  const data: MyStatsType = await response.json();

  const recentActivityResponse = await getRecentActivitiesServerSide();
  const recentActivity = await recentActivityResponse.json();
  const recentActivitiesData: RecentActivityType[] = recentActivity.data;

  const threeLastOpenedPlansResponse = await getThreeLastOpenedPlans();
  const threeLastOpenedPlans : LastProjectOpenedType[] = await threeLastOpenedPlansResponse.json();
  console.log("threeLastOpenedPlans", threeLastOpenedPlans);

  return (
    <Suspense fallback={<div>loading...</div>}>
      <DashboardStats myStats={data} recentActivities={recentActivitiesData} threeLastOpenedPlans={threeLastOpenedPlans}/>
    </Suspense>
  )
}

export default DashboardStatsLoader