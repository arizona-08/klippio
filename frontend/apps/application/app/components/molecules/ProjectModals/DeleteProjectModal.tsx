'use client';
import { useDeleteProjectModalStore } from '@/stores/DeleteProjectModalStore';
import { useOverlayStore } from '@/stores/OverlayStore';
import React from 'react'

interface DeleteProjectModalProps {
  isVisible: boolean;
  onDelete: (projectIdToDelete: string | null) => void;
}

function DeleteProjectModal({ isVisible, onDelete }: DeleteProjectModalProps) {
  const projectIdToDelete = useDeleteProjectModalStore((state) => state.projectIdToDelete);
  const onClose = useDeleteProjectModalStore((state) => state.closeDeleteProjectModal);
  const closeOverlay = useOverlayStore((state) => state.closeOverlay);
  
  function closeModal(){
    onClose();
    closeOverlay();
  }

  function handleDeleteProject(){
    onDelete(projectIdToDelete);
    closeModal();
  }

  return (
    <div 
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50 w-full max-w-md ${isVisible ? 'block' : 'hidden'}`}
    >
      <h2 className='text-xl font-semibold mb-4'>Confirmer la suppression</h2>
      <p className='mb-6'>Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.</p>

      <div className='flex justify-end gap-4'>
        <button 
          className='px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors'
          onClick={closeModal}
        >
          Annuler
        </button>
        <button 
          className='px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors'
          onClick={handleDeleteProject}
        >
          Supprimer
        </button>
      </div>
    </div>
  )
}

export default DeleteProjectModal