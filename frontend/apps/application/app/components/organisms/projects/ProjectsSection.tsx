import React from 'react'
import ProjectCard, { ProjectCardType } from '../../molecules/ProjectCard/ProjectCard'
import { CTA } from '@repo/ui'
import SearchBar from '../../atoms/SearchBar'
import ProjectSorter from './ProjectFilter'

function ProjectsSection() {

  const projects: ProjectCardType[] = [
    {
      id: "projet-1",
      name: 'Projet 1',
      address: '123 Rue de la Paix',
      zipCode: '75000',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 3,
      numberOfPhotos: 15
    },
    {
      id: "projet-2",
      name: 'Projet 2',
      address: '456 Avenue des Champs',
      zipCode: '75008',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 2,
      numberOfPhotos: 7
    },
    {
      id: "projet-3",
      name: 'Projet 3',
      address: '789 Boulevard Saint-Michel',
      zipCode: '75005',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26
    },
  ]
  return (
    <div>
      <div className="my-12 w-full flex flex-col gap-4 md:flex-row-reverse md:items-center md:justify-between">
        <div className="w-full md:max-w-80">
          <SearchBar />
        </div>

        <CTA
          type='button'
          text='Créer un nouveau projet'
          color='primary'
          icon={{
            src: '/icons/plus.svg',
            alt: 'plus icon'
          }}
          iconReverse={true}
        />
      </div>

      <div className="flex items-center justify-end gap-4">
        <ProjectSorter />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
      </ul>
    </div>
  )
}

export default ProjectsSection