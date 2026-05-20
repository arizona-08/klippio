'use client';
import React, { useEffect } from 'react'
import TopBar from './TopBar'
import PlanLoader from '../plan/PlanLoader'
import { PlanType, ProjectType } from '@/types/project';
import { getProjectById } from '@/proxy/projects/project-functions';

interface VisualizerProps {
  project_id: string;
}

function Visualizer({ project_id }: VisualizerProps) {

  const [currentProject, setCurrentProject] = React.useState<ProjectType | null>(null);
  const [currentPlan, setCurrentPlan] = React.useState<PlanType | null>(null);

  useEffect(() => {
    async function fetchProject(){
      try {
        const response = await getProjectById(project_id);
        const result = await response.json();
        setCurrentProject(result);
      } catch (error) {
        console.error('Erreur lors de la récupération du projet :', error);
      }
    }
    fetchProject();
  }, [project_id]);

  function handlePlanChange(plan: PlanType){
    setCurrentPlan(plan);
  }

  
  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <TopBar
        project={currentProject}
        plan={currentPlan}
      />

      <div className="relative flex-1 min-h-0">
        <PlanLoader projectId={project_id} onPlanChange={handlePlanChange} />
      </div>
    </div>
  )
}

export default Visualizer