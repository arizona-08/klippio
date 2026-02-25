'use client';
import React from 'react'
import ProjectCard from '../../molecules/ProjectCard/ProjectCard'
import { CTA } from '@repo/ui'
import SearchBar from '../../atoms/SearchBar'
import ProjectSorter from './ProjectFilter'
import ProjectForm from '../../molecules/ProjectForm/ProjectForm';
import { ProjectType } from '@/types/project';

function ProjectsSection() {

  const projects: ProjectType[] = [
    {
      id: "projet-1",
      name: 'Projet 1',
      address: '123 Rue de la Paix',
      zipCode: '75000',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 3,
      numberOfPhotos: 15,

      collaborators: [
        {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@test.com',
          role: 'owner',
        },
        {
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane@test.com',
          role: 'editor',
          invitationStatus: 'pending'
        },
        {
          firstname: 'Bob',
          lastname: 'Johnson',
          email: 'bob@test.com',
          role: 'viewer',
          invitationStatus: 'accepted'
        }
      ] 
    },
    {
      id: "projet-2",
      name: 'Projet 2',
      address: '456 Avenue des Champs',
      zipCode: '75008',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 2,
      numberOfPhotos: 7,

      collaborators: [
        {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@test.com',
          role: 'owner',
        },
        {
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane@test.com',
          role: 'editor',
          invitationStatus: 'declined'
        },
        {
          firstname: 'Bob',
          lastname: 'Johnson',
          email: 'bob@test.com',
          role: 'viewer',
          invitationStatus: 'pending'
        }
      ] 
    },
    {
      id: "projet-3",
      name: 'Projet 3',
      address: '789 Boulevard Saint-Michel',
      zipCode: '75005',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26,

      collaborators: [
        {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@test.com',
          role: 'owner',
        },
        {
          firstname: 'Bob',
          lastname: 'Johnson',
          email: 'bob@test.com',
          role: 'viewer',
          invitationStatus: 'accepted'
        }
      ] 
    },
    {
      id: "projet-4",
      name: 'Projet 4',
      address: '101 Rue de Rivoli',
      zipCode: '75001',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26,

      collaborators: [
        {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@test.com',
          role: 'owner',
        }
      ] 
    },
    {
      id: "projet-5",
      name: 'Projet 5',
      address: '202 Avenue Montaigne',
      zipCode: '75008',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26,

      collaborators: [
        {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@test.com',
          role: 'owner',
        },
        {
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane@test.com',
          role: 'editor',
          invitationStatus: 'accepted'
        },
        {
          firstname: 'Bob',
          lastname: 'Johnson',
          email: 'bob@test.com',
          role: 'viewer',
          invitationStatus: 'accepted'
        }
      ] 
    },
    {
      id: "projet-6",
      name: 'Projet 6',
      address: '303 Rue de la Paix',
      zipCode: '75002',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26,

      collaborators: [
        {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@test.com',
          role: 'owner',
        },
        {
          firstname: 'Jane',
          lastname: 'Smith',
          email: 'jane@test.com',
          role: 'editor',
          invitationStatus: 'accepted'
        },
        {
          firstname: 'Bob',
          lastname: 'Johnson',
          email: 'bob@test.com',
          role: 'viewer',
          invitationStatus: 'accepted'
        }
      ] 
    },
    {
      id: "projet-7",
      name: 'Projet 7',
      address: '404 Rue de la Paix',
      zipCode: '75003',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26,

      collaborators: [
        {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@test.com',
          role: 'owner',
        }
      ] 
    },
    {
      id: "projet-8",
      name: 'Projet 8',
      address: '505 Rue de la Paix',
      zipCode: '75004',
      city: 'Paris',
      thumbnailUrl: '',
      numberOfPlans: 4,
      numberOfPhotos: 26,

      collaborators: [
        {
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@test.com',
          role: 'owner',
        }
      ] 
    },
  ]

  const [isProjectFormOpen, setIsProjectFormOpen] = React.useState(false);

  const numberOfDisplayedProjects = 6; // à adapter selon le nombre de projets par page souhaité
  const [paginationCount, setPaginationCount] = React.useState(Math.ceil(projects.length / numberOfDisplayedProjects)) // à adapter selon le nombre de projets par page souhaité
  
  const [currentPage, setCurrentPage] = React.useState(1)
  const [displayedProjects, setDisplayedProjects] = React.useState<ProjectType[]>(projects.slice((currentPage - 1) * numberOfDisplayedProjects, currentPage * numberOfDisplayedProjects));


  function previousPage(){
    setCurrentPage(prev => Math.max(prev - 1, 1))
    if(currentPage > 1){
      setDisplayedProjects(projects.slice((currentPage - 2) * numberOfDisplayedProjects, (currentPage - 1) * numberOfDisplayedProjects));
    }
  }

  function nextPage(){
    setCurrentPage(prev => Math.min(prev + 1, paginationCount))
    if(currentPage < paginationCount){
      setDisplayedProjects(projects.slice(currentPage * numberOfDisplayedProjects, (currentPage + 1) * numberOfDisplayedProjects));
    }
  }

  function jumpToPage(page: number) {
    setCurrentPage(page);
    setDisplayedProjects(projects.slice((page - 1) * numberOfDisplayedProjects, page * numberOfDisplayedProjects));
  }

  function searchProject(query: string) {
    if(!query || query.trim() === '') {
      setDisplayedProjects(projects.slice((currentPage - 1) * numberOfDisplayedProjects, currentPage * numberOfDisplayedProjects));
      setPaginationCount(Math.ceil(projects.length / numberOfDisplayedProjects));
      setCurrentPage(1);
      return;
    }

    setCurrentPage(1);

    const foundProjects = projects.filter(project => 
      project.name.toLowerCase().includes(query.toLowerCase()) ||
      project.address.toLowerCase().includes(query.toLowerCase()) ||
      project.city.toLowerCase().includes(query.toLowerCase())
    );
    
    setDisplayedProjects(foundProjects.slice((currentPage - 1) * numberOfDisplayedProjects, currentPage * numberOfDisplayedProjects));
    setPaginationCount(Math.ceil(foundProjects.length / numberOfDisplayedProjects));
  }

  return (
    <div className=''>
      {/* <DeleteProjectModal /> */}
      <div className="top-projects-bar sticky top-20 z-20 p-4  w-full bg-white">
        <div className="flex flex-col gap-4 md:flex-row-reverse md:items-center md:justify-between">
          <div className="w-full md:max-w-80">
            <SearchBar onSearch={searchProject} />
          </div>

          <div className='relative w-full flex flex-col md:inline-block'>
            <CTA
              type='button'
              text='Créer un nouveau projet'
              color='primary'
              icon={{
                src: '/icons/plus.svg',
                alt: 'plus icon'
              }}
              iconReverse={true}
              onClick={() => setIsProjectFormOpen(true)}
            />

            <div className={`absolute left-0 z-40 ${isProjectFormOpen ? 'visible opacity-100 top-full' : 'opacity-0 invisible top-20'} transition-all duration-150`}>
              <ProjectForm closeForm={() => setIsProjectFormOpen(false)} />
            </div>
          </div>
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
        <button className="pagination-button px-3 py-1 mx-1 rounded-md bg-primary-light text-primary hover:bg-primary hover:text-white transition-all duration-150" onClick={previousPage}>Previous</button>
        <div className="space-x-4">
          {[...Array(paginationCount)].map((_, index) => (
            <button key={index} className={`pagination-button px-3 py-1 rounded-md  hover:bg-primary hover:text-white transition-all duration-150 ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-primary-light text-primary'}`} onClick={() => jumpToPage(index + 1)}>{index + 1}</button>
          ))}
          
        </div>
        <button className="pagination-button px-3 py-1 mx-1 rounded-md bg-primary-light text-primary hover:bg-primary hover:text-white transition-all duration-150" onClick={nextPage}>Next</button>
      </div>
    </div>
  )
}

export default ProjectsSection