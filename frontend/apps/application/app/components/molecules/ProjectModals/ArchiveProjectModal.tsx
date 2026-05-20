'use client';
import { useArchiveProjectStore } from '@/stores/ArchiveProjectStore';
import React from 'react'

interface ArchiveProjectModalProps {
  isVisible: boolean;
  onArchive: (projectIdToArchive: string | null, projectName: string | null) => Promise<void>;
}

function ArchiveProjectModal({ isVisible, onArchive }: ArchiveProjectModalProps) {
  const projectToArchive = useArchiveProjectStore((state) => state.projectToArchive);
  const onClose = useArchiveProjectStore((state) => state.closeArchiveProjectModal);
  
  function closeModal(){
    onClose();
  }

  async function handleArchiveProject(){
    await onArchive(projectToArchive?.id || null, projectToArchive?.name || null);
    closeModal();
  }

  if(!isVisible) return null;

  return (
    <>
      <div className="darkLayer fixed inset-0 z-40 bg-black/50 backdrop-blur-2xl"></div>
      <div 
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50 w-full max-w-md `}
      >
        <h2 className='text-xl font-semibold mb-4'>Confirmer l'archivage</h2>
        <p className='mb-6'>Êtes-vous sûr de vouloir archiver le projet "{projectToArchive?.name}" ?</p>

        <div className='flex justify-end gap-4'>
          <button 
            className='px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors'
            onClick={closeModal}
          >
            Annuler
          </button>
          <button 
            className='px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors'
            onClick={handleArchiveProject}
          >
            Archiver
          </button>
        </div>
      </div>
    </>
  )
}

export default ArchiveProjectModal