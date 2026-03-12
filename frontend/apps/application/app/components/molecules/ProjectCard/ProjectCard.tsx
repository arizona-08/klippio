import React from 'react'
import ProjectManager from './ProjectManager';
import { ProjectType } from '@/types/project';
import Link from 'next/link';

interface ProjectCardProps {
  project: ProjectType;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function openMenu(){
    setIsMenuOpen(true);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }
  
  return (
    <>
      <li className='w-full cursor-pointer border border-gray-200 rounded-md p-4 hover:shadow-sm hover:scale-101 transition-all duration-150 relative hover:z-10'>
        <Link href={`/project/${project.id}/visualize`}>
          <div className="relative project-pic-container bg-gray-500 aspect-video rounded-md mb-4">
            <div className="absolute top-5 right-5 bg-primary-light rounded-full px-2 py-1 text-primary text-xs text-center">
              <span className="font-medium">{project.numberOfPlans} Plans, {project.numberOfPhotos} Photos</span>
            </div>
          </div>

          <div className="project-infos-container">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <ProjectManager project={project} isMenuOpen={isMenuOpen} openMenu={openMenu} closeMenu={closeMenu} />
            </div>

            <p className="text-gray-700">{project.address}, {project.zipCode} {project.city}</p>
          </div>
        </Link>
      </li>
    </>
  )
}

export default ProjectCard