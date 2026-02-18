import React from 'react'

function DeleteProjectModal() {
  

  function closeModal(){
    
  }

  function handleDeleteProject(){
    console.log("delete project");
    closeModal();
  }
  return (
    <div 
      className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg z-50 w-full max-w-md'
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