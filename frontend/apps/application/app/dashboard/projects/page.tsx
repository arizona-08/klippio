import ProjectsSectionLoader from '@/app/components/molecules/ProjectsSectionLoader'
import DisplayProjectsListSkeleton from '@/app/components/skeletons/ProjectsListSkeleton/ProjectListSkeleton'
import React, { Suspense } from 'react'

function ProjectsPage() {
  return (
    <div className="Dashboard-root-container">
      <div className="sticky top-0 z-20 p-4">
        <span>Bonjour User!</span>
        <h1 className="mt-2 text-2xl font-semibold">Mes projets</h1>
      </div>
      
      <Suspense fallback={<DisplayProjectsListSkeleton />}>
        <ProjectsSectionLoader mode="basic" />
      </Suspense>
    </div>
  )
}

export default ProjectsPage