import React from 'react'
import ProjectManager from './ProjectManager';

export type ProjectCardType = {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  city: string;
  thumbnailUrl: string;

  numberOfPlans: number;
  numberOfPhotos: number;
}

interface ProjectCardProps {
  project: ProjectCardType;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <>
      <li className='w-full cursor-pointer border border-gray-200 rounded-md p-4 hover:shadow-md hover:scale-105 transition-all duration-150'>
        <div className="relative project-pic-container bg-gray-500 aspect-video rounded-md mb-4">
          <div className="absolute top-5 right-5 bg-primary-light rounded-full px-2 py-1 text-primary text-xs text-center">
            <span className="font-medium">{project.numberOfPlans} Plans, {project.numberOfPhotos} Photos</span>
          </div>
        </div>

        <div className="project-infos-container">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <ProjectManager />
          </div>

          <p className="text-gray-700">{project.address}, {project.zipCode} {project.city}</p>
        </div>
      </li>
    </>
  )
}

export default ProjectCard