import ProjectsSectionLoader from '@/app/components/molecules/ProjectsSectionLoader'
import DisplayProjectsListSkeleton from '@/app/components/skeletons/ProjectsListSkeleton/ProjectListSkeleton'
import React, { Suspense } from 'react'

function ArchivesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Mes projets archivés</h1>

      <Suspense fallback={<DisplayProjectsListSkeleton />}>
        <ProjectsSectionLoader mode="archive" />
      </Suspense>
    </div>
  )
}

export default ArchivesPage