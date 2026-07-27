'use client';
import React, { useEffect } from 'react'
import TopBar from './TopBar'
import PlanLoader from '../plan/PlanLoader'
import { PlanType, ProjectPermissions, ProjectType } from '@/types/project';
import { getProjectById, getProjectPermissions } from '@/proxy/projects/project-functions';

interface VisualizerProps {
  project_id: string;
}

function Visualizer({ project_id }: VisualizerProps) {

  const [currentProject, setCurrentProject] = React.useState<ProjectType | null>(null);
  const [currentPlan, setCurrentPlan] = React.useState<PlanType | null>(null);
  const [permissions, setPermissions] = React.useState<ProjectPermissions | null>(null);
  const [permissionError, setPermissionError] = React.useState<string | null>(null);

  useEffect(() => {
    async function fetchProject(){
      try {
        const [permissionsResponse, projectResponse] = await Promise.all([
          getProjectPermissions(project_id),
          getProjectById(project_id),
        ]);

        if (!permissionsResponse.ok) {
          setPermissionError('Vous n’avez plus accès à ce projet.');
          return;
        }

        setPermissions(await permissionsResponse.json());
        if (projectResponse.ok) {
          setCurrentProject(await projectResponse.json());
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du projet :', error);
        setPermissionError('Impossible de vérifier vos droits sur ce projet.');
      }
    }
    fetchProject();
  }, [project_id]);

  const handlePlanChange = React.useCallback((plan: PlanType | null) => {
    setCurrentPlan(plan);
  }, []);

  
  return (
    <div className="flex-1 overflow-auto flex flex-col">
      <TopBar
        project={currentProject}
        plan={currentPlan}
      />

      <div className="relative flex-1 min-h-0">
        {permissionError ? (
          <div className="flex h-full items-center justify-center p-6 text-center text-gray-600">
            {permissionError}
          </div>
        ) : permissions ? (
          <PlanLoader
            projectId={project_id}
            canEdit={permissions.canEdit}
            onPlanChange={handlePlanChange}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">Vérification des droits…</div>
        )}
      </div>
    </div>
  )
}

export default Visualizer
