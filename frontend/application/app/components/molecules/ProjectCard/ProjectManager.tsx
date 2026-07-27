'use client';
import React from 'react'
import { useDeleteProjectModalStore } from '@/stores/DeleteProjectModalStore';
import { useOverlayStore } from '@/stores/OverlayStore';
import { useModifyProjectStore } from '@/stores/ModifyProjectStore';
import { ProjectType } from '@/types/project';
import { useShareProjectModalStore } from '@/stores/ShareProjectModalStore';
import { Archive, Edit, Share, Trash } from 'lucide-react';
import { useArchiveProjectStore } from '@/stores/ArchiveProjectStore';
import { useUnarchiveProjectStore } from '@/stores/UnarchiveProjectStore';


interface ProjectManagerProps {
  project: ProjectType;
  canShareProject: boolean;
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

function ProjectManager({ project, canShareProject, isMenuOpen, openMenu, closeMenu }: ProjectManagerProps) {
 const isArchived = project.isArchived;

  React.useEffect(() => {
    function handleClickOutsideMenu(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.projectManagerMenu')) {
        closeMenu();
      }
    }

    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, [closeMenu]);

  function openDeleteProjectModal(){
    useOverlayStore.getState().openOverlay();
    useDeleteProjectModalStore.getState().openDeleteProjectModal(project.id);
  }

  const openModifyForm = useModifyProjectStore((state) => state.openModifyProjectModal);
  
  const openModifyProjectForm = () => {
    openModifyForm(project);
    useOverlayStore.getState().openOverlay();
  }

  const openShareProjectModal = useShareProjectModalStore((state) => state.openShareProjectModal);

  const openShareProjectForm = () => {
    openShareProjectModal(project);
    useOverlayStore.getState().openOverlay();
  }

  function handleOpenMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    openMenu();
  }

  const openArchiveProjectModal = useArchiveProjectStore((state) => state.openArchiveProjectModal);
  const openUnarchiveProjectModal = useUnarchiveProjectStore((state) => state.openUnarchiveProjectModal);

  return (
    <>
      <div className="relative ">
        <div className=" flex flex-col items-end gap-1 w-4 cursor-pointer" onClick={handleOpenMenu}>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
        </div>

        <div
          className={`projectManagerMenu absolute  right-4  mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-48 ${isMenuOpen ? 'opacity-100 visible -top-9 z-10' : 'opacity-0 invisible top-14' } transition-all duration-150 projectManagerMenu`}
          onClick={(e) => e.stopPropagation()}  
        >
          <ul className="flex flex-col gap-2">
            {!isArchived && (
              <>
                <li className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 cursor-pointer" onClick={openModifyProjectForm}> <Edit className="w-4 h-4"/> Modifier</li>
                {canShareProject && (
                  <li className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 cursor-pointer" onClick={openShareProjectForm}> <Share className="w-4 h-4"/> Partager</li>
                )}
              </>
            ) }
            <li className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 cursor-pointer" onClick={() => {
              if(isArchived){
                openUnarchiveProjectModal(project.id, project.title);
                return;
              } else if (!isArchived){
                openArchiveProjectModal(project.id, project.title);
                return;
              }
              
              }}> <Archive className="w-4 h-4"/> {isArchived ? 'Désarchiver' : 'Archiver'}</li>
            <li className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-100 rounded-md px-2 py-1 cursor-pointer" onClick={openDeleteProjectModal}> <Trash className="w-4 h-4"/> Supprimer</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default ProjectManager
