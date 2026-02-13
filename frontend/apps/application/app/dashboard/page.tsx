import React from 'react'
import ProjectsSection from '../components/organisms/projects/ProjectsSection'

function DashboardRoot() {
  return (
    <div className="Dashboard-root-container p-4">
      <span>Bonjour User!</span>
      <h1 className="mt-2 text-2xl font-semibold">Mes projets</h1>
      
      <ProjectsSection />
    </div>
  )
}

export default DashboardRoot