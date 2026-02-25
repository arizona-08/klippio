'use client';
import React from 'react'
import Input from '../../atoms/Input';
import { CTA } from '@repo/ui';
import { useOverlayStore } from '@/stores/OverlayStore';
import { useShareProjectModalStore } from '@/stores/ShareProjectModalStore';


interface ShareProjectFormProps {
  closeForm: () => void;
}

function ShareProjectForm({ closeForm }: ShareProjectFormProps) {
  const closeOverlay = useOverlayStore((state) => state.closeOverlay);
  const projectToShare = useShareProjectModalStore((state) => state.projectToShare);

  function handleClose(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();
    closeForm();
    closeOverlay();
  }

  return (
    <form 
      className='bg-white w-full p-4 rounded-md border border-gray-300 shadow-lg'
    >
      <h2 className='text-xl font-semibold mb-4'>Partager le projet {projectToShare?.name}</h2>

      <div className="flex flex-col gap-3">
        <Input
          type='text'
          label="Email du collaborateur"
          name="collaboratorEmail"
          placeholder="Entrez l'email de votre collaborateur"
        />
      </div>

      <div className="collaborators">
        <h3 className='text-md font-medium mt-6 mb-2'>Collaborateurs actuels</h3>
        {
          projectToShare && (
            <div className="bg-gray-50 p-2 rounded-md">

              <ul className='space-y-4'>
                {projectToShare.collaborators.map((collaborator, index) => (
                  <li key={index} className='flex items-center justify-between'>
                    <div className="flex items-center gap-3">
                      <div className="profile-pic-container w-8 h-8 bg-gray-200 rounded-full"></div>

                      <div>
                        <p className='text-base/tight font-medium'>{collaborator.firstname} {collaborator.lastname}</p>
                        <p className="text-sm/tight">{collaborator.email}</p>
                      </div>
                    </div>

                    {collaborator.role === 'owner' && <span className='text-xs text-primary-light bg-primary/20 px-2 py-1 rounded-full'>Propriétaire</span>}
                    {collaborator.role != 'owner' && collaborator.invitationStatus === 'accepted' && <button type='button' className='text-red-500 text-sm'>Retirer</button>}
                    {collaborator.role != 'owner' && collaborator.invitationStatus === 'pending' && <span className='text-xs text-yellow-500 bg-yellow-100 px-2 py-1 rounded-full'>En attente</span>}
                    {collaborator.role != 'owner' && collaborator.invitationStatus === 'declined' && <span className='text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full'>Refusé</span>}
                    
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      </div>

      <div className="actions mt-4 flex justify-between">
        <CTA type='button' color='primary' text='Ajouter'/>
        <CTA type='button' color='secondary' text='Annuler' onClick={(e) => handleClose(e)}/>
      </div>
    </form>
  )
}

export default ShareProjectForm