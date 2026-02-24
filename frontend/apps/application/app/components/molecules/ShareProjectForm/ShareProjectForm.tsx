'use client';
import React from 'react'
import Input from '../../atoms/Input';
import { CTA } from '@repo/ui';
import { useOverlayStore } from '@/stores/OverlayStore';


interface ShareProjectFormProps {
  closeForm: () => void;
}

function ShareProjectForm({ closeForm }: ShareProjectFormProps) {
  const closeOverlay = useOverlayStore((state) => state.closeOverlay);

  function handleClose(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();
    closeForm();
    closeOverlay();
  }

  return (
    <form 
      className='bg-white w-full max-w-96 p-4 rounded-md border border-gray-300 shadow-lg'
    >
      <h2 className='text-xl font-semibold mb-4'>Partager le projet</h2>

      <div className="flex flex-col gap-3">
        <Input
          type='text'
          label="Email du collaborateur"
          name="collaboratorEmail"
          placeholder="Entrez l'email de votre collaborateur"
        />
      </div>

      <div className="actions mt-4 flex justify-between">
        <CTA type='button' color='primary' text='Ajouter'/>
        <CTA type='button' color='secondary' text='Annuler' onClick={(e) => handleClose(e)}/>
      </div>
    </form>
  )
}

export default ShareProjectForm