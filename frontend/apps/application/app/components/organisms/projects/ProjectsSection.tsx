import React from 'react'
import ProjectCard, { ProjectCardType } from '../../molecules/ProjectCard/ProjectCard'
import { CTA } from '@repo/ui'
import SearchBar from '../../atoms/SearchBar'

function ProjectsSection() {

  const projects: ProjectCardType[] = [
    {
      id: "projet-1",
      name: 'Projet 1',
      address: '123 Rue de la Paix',
      zipCode: '75000',
      city: 'Paris',
      thumbnailUrl: ''
    },
    {
      id: "projet-2",
      name: 'Projet 2',
      address: '456 Avenue des Champs',
      zipCode: '75008',
      city: 'Paris',
      thumbnailUrl: ''
    },
    {
      id: "projet-3",
      name: 'Projet 3',
      address: '789 Boulevard Saint-Michel',
      zipCode: '75005',
      city: 'Paris',
      thumbnailUrl: ''
    },
  ]
  return (
    <div>
      <div className="my-12 max-w-96 flex flex-col gap-4">
        <SearchBar />
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

      <ul className="flex flex-col gap-6 mt-4 md:flex-row md:flex-wrap">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
      </ul>
    </div>
  )
}

export default ProjectsSection