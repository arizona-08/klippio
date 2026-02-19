'use client';
import React from 'react'
import { useDeleteProjectModalStore } from '@/stores/DeleteProjectModalStore';
import { useOverlayStore } from '@/stores/OverlayStore';

interface ProjectManagerProps {
  projectId: string;
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}
function ProjectManager({ projectId, isMenuOpen, openMenu, closeMenu }: ProjectManagerProps) {

  React.useEffect(() => {
    function handleClickOutsideMenu(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.projectManagerMenu')) {
        closeMenu();
      }
    }

    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, []);

  function openDeleteProjectModal(){
    useOverlayStore.getState().openOverlay();
    useDeleteProjectModalStore.getState().openDeleteProjectModal(projectId);
  }

  return (
    <>
      <div className="relative">
        <div className=" flex flex-col items-end gap-1 w-4 cursor-pointer" onClick={openMenu}>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
        </div>

        <div className={`projectManagerMenu absolute  right-4  mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-32 ${isMenuOpen ? 'opacity-100 visible -top-9 z-10' : 'opacity-0 invisible top-14' } transition-all duration-150 projectManagerMenu`}>
          <ul className="flex flex-col gap-2">
            <li className="text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 cursor-pointer">Modifier</li>
            <li className="text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 cursor-pointer">Partager</li>
            <li className="text-sm text-red-500 hover:bg-red-100 rounded-md px-2 py-1 cursor-pointer" onClick={openDeleteProjectModal}>Supprimer</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default ProjectManager