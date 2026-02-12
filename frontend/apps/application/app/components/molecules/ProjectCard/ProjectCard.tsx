import React from 'react'
import ProjectManager from './ProjectManager';

export type ProjectCardType = {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  city: string;
  thumbnailUrl: string;
}

interface ProjectCardProps {
  project: ProjectCardType;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <>
      <li className='w-full md:max-w-80 cursor-pointer'>
        <div className="project-pic-container bg-gray-500 aspect-video rounded-md mb-4">

        </div>

        <div className="project-infos-container">
          <div className="flex items-center justify-between">
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