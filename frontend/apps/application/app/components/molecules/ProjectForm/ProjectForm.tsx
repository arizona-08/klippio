'use client'
import React from 'react'
import Input from '../../atoms/Input'
import { CreateProjectDTO } from '@/proxy/projects/dto/create-project.dto'
import { CTA } from '@repo/ui'
import { useModifyProjectStore } from '@/stores/ModifyProjectStore'
import { ProjectType } from '@/types/project'
import { createProject, modifyProject } from '@/proxy/projects/project-functions'
import { createRecentActivity } from '@/proxy/recent-activity/recent-activity-functions'
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider'

interface ProjectFormProps {
  closeForm: () => void;
  edit?: boolean;
  projectToEdit?: ProjectType;
  onSuccess?: (project: ProjectType) => void; // Optional callback to update the UI after successful creation/modification
}

function ProjectForm({ closeForm, edit, projectToEdit, onSuccess }: ProjectFormProps) {
  const {user} = useUser();
  const [projectCredentials, setProjectCredentials] = React.useState<CreateProjectDTO>({
    title: '',
    address: '',
    zipcode: '',
    city: '',
  });

  function resetForm() {
    setProjectCredentials({
      title: '',
      address: '',
      zipcode: '',
      city: '',
    });
  };

  React.useEffect(() => {
    if(edit && projectToEdit) {
      setProjectCredentials({
        title: projectToEdit.title,
        address: projectToEdit.address,
        zipcode: projectToEdit.zipcode,
        city: projectToEdit.city,
      });
    }
  }, [projectToEdit]);
  

  const closeModifyForm = useModifyProjectStore((state) => state.closeModifyProjectModal);

  async function handleSubmit(e?: React.MouseEvent<HTMLButtonElement, MouseEvent>){ 
    e?.preventDefault();
    
    let pickedFunction;
    let recentActivityDescription;

    if(edit && projectToEdit){
      pickedFunction = () => modifyProject(projectCredentials, projectToEdit.id.toString());
      recentActivityDescription = `Projet "${projectToEdit.title}" renommé en "${projectCredentials.title}"`;
    } else {
      pickedFunction = () => createProject(projectCredentials);
      recentActivityDescription = `Projet "${projectCredentials.title}" créé`;
    }

    try{
      const response = await pickedFunction();

      if(response.ok){
        resetForm();
        closeForm();
        closeModifyForm();

        const responseData = await response.json();
        onSuccess?.(responseData);

        // faire en sorte de récupérer les Ids de tout les collaborateurs du projet
        const recentActivityResponse = await createRecentActivity([user?.id as number], recentActivityDescription);
        if(!recentActivityResponse.ok){
          console.error('Failed to create recent activity');
        }
      } else {
        // Handle error response, e.g., show an error message
        console.error('Failed to submit project form');
      }
    } catch (error) {
      console.error('Error occurred while submitting project form', error);
    }

  }


  return (
    <>
      <form 
        method="post"
        className={`projectForm space-y-3 bg-white p-4 rounded-md border border-gray-300  min-w-72 max-w-96 mt-4 shadow-lg transition-all duration-150`}
      >
        <Input
          type='text' 
          label="Titre"
          name="title"
          placeholder="Titre de votre projet"
          value={projectCredentials.title}
          onChange={(e) => setProjectCredentials({...projectCredentials, title: e.target.value})}
        />
        <Input
          type='text' 
          label="Adresse"
          name="address"
          placeholder="10 rue de la Paix"
          value={projectCredentials.address}
          onChange={(e) => setProjectCredentials({...projectCredentials, address: e.target.value})}
        />
        <Input
          type='text' 
          label="Code postal"
          name="zipcode"
          placeholder="75000"
          value={projectCredentials.zipcode}
          onChange={(e) => setProjectCredentials({...projectCredentials, zipcode: e.target.value})}
        />
        <Input
          type='text' 
          label="Ville"
          name="city"
          placeholder="Paris"
          value={projectCredentials.city}
          onChange={(e) => setProjectCredentials({...projectCredentials, city: e.target.value})}
        />

        <div className="form-actions flex items-center justify-between mt-6 gap-4">
          <CTA
            type='button'
            color='secondary'
            text='Annuler'
            onClick={(e) => {
              e?.preventDefault();
              resetForm();
              closeForm();
              closeModifyForm();
            }}
          />

          <CTA
            type='button'
            color='primary'
            text={edit ? 'Modifier' : 'Créer'}
            onClick={handleSubmit}
          />
        </div>
      </form>
    </>
  )
}

export default ProjectForm