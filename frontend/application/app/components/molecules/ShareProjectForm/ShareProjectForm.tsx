'use client';
import React, { useEffect } from 'react'
import Input from '../../atoms/Input';
import { useOverlayStore } from '@/stores/OverlayStore';
import { useShareProjectModalStore } from '@/stores/ShareProjectModalStore';
import CTA from '../../atoms/CTA';
import { inviteCollaboratorToProject } from '@/proxy/projects/project-functions';
import { ProjectInvitationType } from '@/types/project';
import { formatDate } from '@/utils/date';


interface ShareProjectFormProps {
  closeForm: () => void;
}

function ShareProjectForm({ closeForm }: ShareProjectFormProps) {
  const closeOverlay = useOverlayStore((state) => state.closeOverlay);
  const projectToShare = useShareProjectModalStore((state) => state.projectToShare);
  const [invitationsMasterList, setInvitationsMasterList] = React.useState<ProjectInvitationType[]>([]);

  useEffect(() => {
    setInvitationsMasterList(projectToShare?.invitations || []);
  }, [projectToShare?.invitations])

  const [selectedRole, setSelectedRole] = React.useState<"EDITOR" | "VIEWER">("EDITOR");
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

  async function handleSendInvitation(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();

    const response = await inviteCollaboratorToProject(projectToShare?.id || "", collaboratorsEmail, selectedRole);
    if(!response.ok) {
      console.error("Error sending invitation:", response.statusText);
      return;
      // afficher un toast d'erreur
    }

    const data = await response.json();
    console.log(data.message);
    setInvitationsMasterList((prev) => [...prev, data.invitation]);
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
          ▼ <p>{selectedRole === "EDITOR" ? "Éditeur" : "Lecteur"}</p>

          <div className={`absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 ${isRoleDropdownOpen ? "block" : "hidden"}`}>
            <ul>
              <li 
                className={'px-4 py-2 hover:bg-gray-100 cursor-pointer' + (selectedRole === "EDITOR" ? " bg-gray-100" : "")}
                onClick={() => setSelectedRole("EDITOR")}
              >
                Éditeur
              </li>

              <li 
                className={'px-4 py-2 hover:bg-gray-100 cursor-pointer' + (selectedRole === "VIEWER" ? " bg-gray-100" : "")}
                onClick={() => setSelectedRole("VIEWER")}
              >
                Lecteur
              </li>
            </ul>
          </div>
        </div>
          
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
                        <p className='text-base/tight font-medium'>{collaborator.user.firstname} {collaborator.user.lastname}</p>
                        <p className="text-sm/tight">{collaborator.user.email}</p>
                      </div>
                    </div>

                    {collaborator.role === 'OWNER' && <span className='text-xs text-primary-light bg-primary/60 px-2 py-1 rounded-full'>Propriétaire</span>}
                  </li>
                ))}
              </ul>
            </div>
          )
        }
      </div>

      <div className="collaborators">
        <h3 className='text-md font-medium mt-6 mb-2'>Invitations en attente</h3>
        {
          projectToShare && (
            <div className="bg-gray-50 p-2 rounded-md">
              {
                invitationsMasterList.length === 0 ? (
                  <div>
                    <p className="text-sm/tight text-gray-500">Aucune invitation en attente</p>
                  </div>
                ) : (
                  <>
                    <ul className='space-y-4'>
                      {invitationsMasterList.map((invitation, index) => (
                        <li key={index} className='flex items-center justify-between'>
                          <div className="flex items-center gap-3">
                            <div className="profile-pic-container w-8 h-8 bg-gray-200 rounded-full"></div>

                            <div>
                              <p className='text-base/tight font-medium'>{invitation.email}</p>
                              <p className="text-sm/tight">Envoyé le {formatDate(invitation.createdAt)}</p>
                            </div>
                          </div>

                          {invitation.status === 'PENDING' && <span className='text-xs text-primary-light bg-orange-400 px-2 py-1 rounded-full'>En attente</span>}
                          {invitation.status === 'DECLINED' && <span className='text-xs text-danger bg-danger/20 px-2 py-1 rounded-full'>Refusée</span>}
                        </li>
                      ))}
                    </ul>
                  </>
                )
              }
            </div>
          )
        }
      </div>

      {showCollaborators && (
        <div className="actions mt-4 flex justify-between">
          <CTA type='button' color='secondary' text='Annuler' onClick={(e) => handleClose(e)}/>
          <CTA type='button' color='primary' text='envoyer' onClick={(e) => handleSendInvitation(e)}/> {/*Faire handle confirm */}
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
