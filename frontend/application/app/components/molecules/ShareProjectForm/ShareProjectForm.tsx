'use client';
import React from 'react'
import Input from '../../atoms/Input';
import { useOverlayStore } from '@/stores/OverlayStore';
import { useShareProjectModalStore } from '@/stores/ShareProjectModalStore';
import CTA from '../../atoms/CTA';


interface ShareProjectFormProps {
  closeForm: () => void;
}

function ShareProjectForm({ closeForm }: ShareProjectFormProps) {
  const closeOverlay = useOverlayStore((state) => state.closeOverlay);
  const projectToShare = useShareProjectModalStore((state) => state.projectToShare);

  const [selectedRole, setSelectedRole] = React.useState<"editor" | "lector">("editor");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = React.useState<boolean>(false);

  const [collaboratorsEmail, setCollaboratorsEmail] = React.useState<string>("");

  function handleClose(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();
    closeForm();
    setCollaboratorsEmail("");
    setIsRoleDropdownOpen(false);
    closeOverlay();
  }

  function handleCollaboratorEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCollaboratorsEmail(e.target.value);
  }

  const showCollaborators = collaboratorsEmail.length > 0;

  return (
    <form 
      className='bg-white w-full p-4 rounded-md border border-gray-300 shadow-lg'
    >
      <h2 className='text-xl font-semibold mb-4'>Partager le projet {projectToShare?.title}</h2>

      <div className="flex gap-3 items-end">
        <div className="grow">
          <Input
            type='text'
            label="Email du collaborateur"
            name="collaboratorEmail"
            placeholder="Entrez l'email de votre collaborateur"
            value={collaboratorsEmail}
            onChange={handleCollaboratorEmailChange}
          />
        </div>

        <div 
          className='relative border border-gray-200 p-2 rounded-md flex gap-3 cursor-pointer hover:bg-gray-100'
          onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
        >
          ▼ <p>{selectedRole === "editor" ? "Éditeur" : "Lecteur"}</p>

          <div className={`absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 ${isRoleDropdownOpen ? "block" : "hidden"}`}>
            <ul>
              <li 
                className={'px-4 py-2 hover:bg-gray-100 cursor-pointer' + (selectedRole === "editor" ? " bg-gray-100" : "")}
                onClick={() => setSelectedRole("editor")}
              >
                Éditeur
              </li>

              <li 
                className={'px-4 py-2 hover:bg-gray-100 cursor-pointer' + (selectedRole === "lector" ? " bg-gray-100" : "")}
                onClick={() => setSelectedRole("lector")}
              >
                Lecteur
              </li>
            </ul>
          </div>
        </div>
          
      </div>

      {!showCollaborators && (
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
      )}

      {showCollaborators && (
        <div className="collaborators mt-6">
          <textarea
            name="collaborators"
            id="collaborators"
            placeholder='Collaborateurs'
            className='w-full border border-gray-200 p-2 rounded-md min-h-35 outline-none focus:ring-2 focus:ring-primary'
          ></textarea>
        </div>
      )}

      {showCollaborators && (
        <div className="actions mt-4 flex justify-between">
          <CTA type='button' color='secondary' text='Annuler' onClick={(e) => handleClose(e)}/>
          <CTA type='button' color='primary' text='envoyer' onClick={(e) => handleClose(e)}/> {/*Faire handle confirm */}
        </div>
      )}

      {!showCollaborators && (
        <div className="actions mt-4 flex justify-end">
          <CTA type='button' color='primary' text='Fermer' onClick={(e) => handleClose(e)}/>
        </div>
      )}
    </form>
  )
}

export default ShareProjectForm