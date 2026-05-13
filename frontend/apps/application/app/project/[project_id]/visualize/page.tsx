import AppMenu from '@/app/components/molecules/AppMenu/AppMenu'
import PlanLoader from '@/app/components/organisms/plan/PlanLoader'
import TopBar from '@/app/components/organisms/visualizer/TopBar';
import Visualizer from '@/app/components/organisms/visualizer/Visualizer';
import App from 'next/app'
import React from 'react'

async function VisualizePage({ params } : { params: Promise<{ project_id: string }> }) {

  const { project_id } = await params;

  return (
    <div className="flex flex-col h-screen lg:flex-row">
      <AppMenu />
      {/* <div className="flex-1 overflow-auto flex flex-col">
        <TopBar />

        <div className="relative flex-1 min-h-0">
          <PlanLoader projectId={project_id} />
        </div>
      </div> */}

      <Visualizer project_id={project_id} />
    </div>
  )
}

export default VisualizePage