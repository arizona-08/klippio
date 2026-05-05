'use server'
import React, { Suspense } from 'react'
import ProjectsSection from '../components/organisms/projects/ProjectsSection'
import { get } from 'http'
import { getProjectsServerSide } from '@/proxy/projects/project-functions';
import ProjectsSectionLoader from '../components/molecules/ProjectsSectionLoader';
import ProjectCardSkeleton from '../components/skeletons/ProjectsListSkeleton/ProjectCardSkeleton';
import DisplayProjectsListSkeleton from '../components/skeletons/ProjectsListSkeleton/ProjectListSkeleton';

async function DashboardRoot() {
  
  return (
    <div className="Dashboard-root-container">
      <div className="sticky top-0 z-20 bg-white p-4">
        <span>Bonjour User!</span>
        <h1 className="mt-2 text-2xl font-semibold">Mes projets</h1>
      </div>
      
      <Suspense fallback={<DisplayProjectsListSkeleton />}>
        <ProjectsSectionLoader mode="basic" />
      </Suspense>
    </div>
  )
}



export default DashboardRoot