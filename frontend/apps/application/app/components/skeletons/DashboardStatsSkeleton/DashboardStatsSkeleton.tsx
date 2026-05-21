import { useSidebarStore } from '@/stores/SidebarStore';
import React from 'react'
import StatsCardSkeleton from './StatsCardSkeleton';
import QuickResumeSkeleton from './QuickResumeSkeleton';
import StatsRecentActivitySkeleton from './StatsRecentActivitySkeleton';

function DashboardStatsSkeleton() {
  const isSideBarOpenAndVisible = useSidebarStore(state => state.isVisibleAndOpen);

  return (
        <section className="flex-1 min-h-0">
      <div className="h-full overflow-y-auto px-4 py-6 lg:px-8">
        <div
          className={`grid gap-6 ${
            isSideBarOpenAndVisible
              ? 'lg:grid-cols-1 xl:grid-cols-[1fr_280px]'
              : 'lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]'
          }`}
        >
          <div className="flex flex-col gap-6">
            <div
              className={`grid gap-6 ${
                isSideBarOpenAndVisible
                  ? 'md:grid-cols-2 xl:grid-cols-3'
                  : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {Array.from({length: 4}).map((_, index) => (
                <StatsCardSkeleton key={index} />
              ))}


            </div>

            <QuickResumeSkeleton />
          </div>
          <StatsRecentActivitySkeleton />
        </div>
      </div>
    </section>
  )
}

export default DashboardStatsSkeleton