import AppMenu from '@/app/components/molecules/AppMenu/AppMenu'
import Visualizer from '@/app/components/organisms/visualizer/Visualizer';
import React from 'react'

async function VisualizePage({ params } : { params: Promise<{ project_id: string }> }) {

  const { project_id } = await params;

  return (
    <div className="flex flex-col h-screen lg:flex-row">
      <AppMenu />
      <Visualizer project_id={project_id} />
    </div>
  )
}

export default VisualizePage