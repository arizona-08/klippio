'use server'
import React, { Suspense } from 'react'
import ProjectsSection from '../components/organisms/projects/ProjectsSection'
import { get } from 'http'
import { getProjectsServerSide } from '@/proxy/projects/project-functions';
import ProjectsSectionLoader from '../components/molecules/ProjectsSectionLoader';
import ProjectCardSkeleton from '../components/skeletons/ProjectCardSkeleton';

async function DashboardRoot() {
  
  return (
    <div className="Dashboard-root-container">
      <div className="sticky top-0 z-20 bg-white p-4">
        <span>Bonjour User!</span>
        <h1 className="mt-2 text-2xl font-semibold">Mes projets</h1>
      </div>
      
      <Suspense fallback={<DisplayProjectsListSkeleton />}>
        <ProjectsSectionLoader/>
      </Suspense>
    </div>
  )
}

function DisplayProjectsListSkeleton() {
  return (
    <div>
      <ul className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4 py-6">
        {[...Array(6)].map((_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </ul>
    </div>
  )
}

export default DashboardRoot