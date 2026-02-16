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
    {
      id: "projet-4",
      name: 'Projet 4',
      address: '101 Rue de Rivoli',
      zipCode: '75001',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26
    },
    {
      id: "projet-5",
      name: 'Projet 5',
      address: '202 Avenue Montaigne',
      zipCode: '75008',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26
    },
    {
      id: "projet-6",
      name: 'Projet 6',
      address: '303 Rue de la Paix',
      zipCode: '75002',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26
    },
    {
      id: "projet-7",
      name: 'Projet 7',
      address: '404 Rue de la Paix',
      zipCode: '75003',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26
    },
    {
      id: "projet-8",
      name: 'Projet 8',
      address: '505 Rue de la Paix',
      zipCode: '75004',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26
    },
  ]
  return (
    <div className='relative'>
      <div className="top-projects-bar sticky top-20 z-10 py-4 my-2 w-full bg-white">
        <div className="flex flex-col gap-4 md:flex-row-reverse md:items-center md:justify-between">
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

        <div className="flex items-center justify-end gap-4 mt-4">
          <ProjectSorter />
        </div>

      </div>


      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4 py-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
      </ul>

      <div className="pagination-container flex items-center justify-center mt-12">
          <div>
            <button className="pagination-button px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">Previous</button>
            <button className="pagination-button px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">1</button>
            <button className="pagination-button px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">2</button>
            <button className="pagination-button px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">3</button>
            <button className="pagination-button px-3 py-1 mx-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">Next</button>
          </div>
      </div>
    </div>
  )
}

export default ProjectsSection