'use server'
import React from 'react'
import ProjectsSection from '../components/organisms/projects/ProjectsSection'
import { get } from 'http'
import { getProjectsServerSide } from '@/proxy/projects/project-functions';

async function DashboardRoot() {
  const projectsResponse = await getProjectsServerSide();
  const projectsData = await projectsResponse.json();
  
  return (
    <div className="Dashboard-root-container">
      <div className="sticky top-0 z-20 bg-white p-4">
        <span>Bonjour User!</span>
        <h1 className="mt-2 text-2xl font-semibold">Mes projets</h1>
      </div>
      
      <ProjectsSection projects={projectsData} />
    </div>
  )
}

export default DashboardRoot