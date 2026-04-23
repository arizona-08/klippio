'use client';
import React, { useEffect } from 'react'
import ProjectCard from '../../molecules/ProjectCard/ProjectCard'
import { CTA } from '@repo/ui'
import SearchBar from '../../atoms/SearchBar'
import ProjectSorter from './ProjectFilter'
import ProjectForm from '../../molecules/ProjectForm/ProjectForm';
import { ProjectType } from '@/types/project';
import { PlusIcon } from 'lucide-react';
import { getProjects } from '@/proxy/projects/project-functions';

interface ProjectsSectionProps {
  // Define any props if needed
  projects?: ProjectType[]; // Optionally accept projects as props
}

function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [isProjectFormOpen, setIsProjectFormOpen] = React.useState(false);
  const [masterProjectsList, setMasterProjectsList] = React.useState<ProjectType[]>(projects || []);
  const [searchQueryText, setSearchQueryText] = React.useState('');

  const numberOfDisplayedProjects = 6; // à adapter selon le nombre de projets par page souhaité
  const paginationCount = Math.ceil((projects?.length || 0) / numberOfDisplayedProjects)
  
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredProjectsList = masterProjectsList.filter(projectItem => 
    projectItem.title.toLowerCase().includes(searchQueryText.toLowerCase()) ||
    projectItem.address.toLowerCase().includes(searchQueryText.toLowerCase()) ||
    projectItem.city.toLowerCase().includes(searchQueryText.toLowerCase())
  );

  const displayedProjects = filteredProjectsList.slice(
    (currentPage - 1) * numberOfDisplayedProjects, 
    currentPage * numberOfDisplayedProjects
  );

  function previousPage(){
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  function nextPage(){
    setCurrentPage(prev => Math.min(prev + 1, paginationCount))
  }

  function jumpToPage(page: number) {
    setCurrentPage(page);
  }

  function searchProject(query: string) {
    setSearchQueryText(query);
    setCurrentPage(1);
  }

  function addProjectToUi(project: ProjectType){
    setMasterProjectsList((previousList) => {
      const existingProject = previousList.some(p => p.id === project.id);

      if(existingProject){
        return previousList.map(p => p.id === project.id ? project : p);
      }

      return [project, ...previousList]
    });
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
            <div className="md:max-w-90">
              <CTA
                type='button'
                text='Créer un nouveau projet'
                color='primary'
                icon={<PlusIcon />}
                iconReverse={true}
                onClick={() => setIsProjectFormOpen(true)}
              />
            </div>

            <div className={`absolute left-0 z-40 ${isProjectFormOpen ? 'visible opacity-100 top-full' : 'opacity-0 invisible top-20'} transition-all duration-150`}>
              <ProjectForm 
                closeForm={() => setIsProjectFormOpen(false)}
                onSuccess={addProjectToUi}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mt-4">
          <ProjectSorter />
        </div>

      </div>

      {filteredProjectsList.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-medium text-gray-700">Aucun projet trouvé</h3>
          <p className="text-gray-500">Essayez d'ajuster votre recherche ou créez un nouveau projet.</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export default ProjectsSection