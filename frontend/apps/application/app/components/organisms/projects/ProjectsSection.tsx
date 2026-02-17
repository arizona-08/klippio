'use client';
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

  const numberOfDisplayedProjects = 4; // à adapter selon le nombre de projets par page souhaité
  const paginationCount = Math.ceil(projects.length / numberOfDisplayedProjects) // à adapter selon le nombre de projets par page souhaité
  
  const [currentPage, setCurrentPage] = React.useState(1)
  const displayedProjects = projects.slice((currentPage - 1) * numberOfDisplayedProjects, currentPage * numberOfDisplayedProjects) // à adapter selon le nombre de projets par page souhaité

  return (
    <div className='relative'>
      <div className="top-projects-bar sticky top-20 z-10 p-4  w-full bg-white">
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


      <ul className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4 py-6">
          {displayedProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
      </ul>

      <div className="pagination-container flex items-center justify-between mt-8 pb-8 max-w-130 mx-auto">
        <button className="pagination-button px-3 py-1 mx-1 rounded-md bg-primary-light text-primary hover:bg-primary hover:text-white transition-all duration-150" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
        <div className="space-x-4">
          {[...Array(paginationCount)].map((_, index) => (
            <button key={index} className={`pagination-button px-3 py-1 rounded-md  hover:bg-primary hover:text-white transition-all duration-150 ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`} onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
          ))}
          
        </div>
        <button className="pagination-button px-3 py-1 mx-1 rounded-md bg-primary-light text-primary hover:bg-primary hover:text-white transition-all duration-150" onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationCount))}>Next</button>
      </div>
    </div>
  )
}

export default ProjectsSection