import React from 'react'
import ProjectsSection from '../components/organisms/projects/ProjectsSection'

function DashboardRoot() {
  return (
    <div className="Dashboard-root-container">
      <div className="sticky top-0 z-10 bg-white p-4">
        <span>Bonjour User!</span>
        <h1 className="mt-2 text-2xl font-semibold">Mes projets</h1>
      </div>
      
      <ProjectsSection />
    </div>
  )
}

export default DashboardRoot