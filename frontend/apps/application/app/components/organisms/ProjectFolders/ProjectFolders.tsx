'use client';

import { FolderType } from '@/types/project'
import { ArrowLeft, FilePlusCorner, FolderPlus, GripHorizontal } from 'lucide-react'
import React, { useEffect } from 'react'
import ProjectNode from '../../molecules/ProjectNode/ProjectNode'
import { CTA } from '@repo/ui';
import { useProjectNodeStore } from '@/stores/ProjectNodesStore';
import CreateFolderModal from './CreateFolderModal';
import { createFolder } from '@/proxy/folders/folder-functions';

interface ProjectFoldersProps {
  activeFolder: FolderType | null
  projectId: string;
}

function ProjectFolders({ activeFolder, projectId }: ProjectFoldersProps) {

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = React.useState(false);
  //fetch les infos de activeFolderId pour afficher le nom du dossier actif et son contenu (dossiers + plans)

  const isNotEmptyFolder = activeFolder ? (activeFolder.subfolders.length > 0 || activeFolder.plans.length > 0) : false;
  const isRootFolder = activeFolder ? activeFolder.isRoot : false;

  const isProjectsFolderModalOpen = useProjectNodeStore((state) => state.isOpen);
  const closeFolders = useProjectNodeStore((state) => state.close);

  async function handleOnCreateFolder(folderName: string){
    const response = await createFolder(folderName, projectId, activeFolder ? activeFolder.id : null);

    if(!response.ok){
      console.error("Failed to create folder");
      return;
    }

    const result = await response.json();
    const createdFolder = result;
    activeFolder?.subfolders.push(createdFolder); //fonctionnera pas car pas réactif
    setIsCreateFolderModalOpen(false);

  }

  function onSelectNode(){
    
  }

  return (
    <>
      <CreateFolderModal isOpen={isCreateFolderModalOpen} onClose={() => setIsCreateFolderModalOpen(false)} onCreate={handleOnCreateFolder}/>
      <div className={`fixed inset-0 dark-layer bg-black/20 backdrop-blur-sm z-50 ${isProjectsFolderModalOpen ? 'block' : 'hidden'}`}></div>
      <div className={`fixed left-0 bottom-0 w-full h-150 bg-white py-8 px-4 rounded-t-lg z-50 md:max-w-150 md:h-fit md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 ${isProjectsFolderModalOpen ? 'block' : 'hidden'}`}>
        <div className="w-full flex items-center justify-center mb-2">
          <GripHorizontal className="text-gray-200"/>
        </div>
        <div className="mb-4 ">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => {}}>
            <ArrowLeft className={`${isRootFolder ? 'hidden' : 'block'}`}/>
            <h2 className="text-xl font-semibold ">Sélectionner un plan</h2>
            <div className="create-actions flex-1 flex items-center justify-end gap-1">
              <div className="p-1 hover:bg-gray-100 rounded-md">
                <FilePlusCorner className="h-6 w-6"/>
              </div>

              <div className="p-1 hover:bg-gray-100 rounded-md" onClick={() => setIsCreateFolderModalOpen(true)}>
                <FolderPlus className="h-6 w-6"/>
              </div>
            </div>
          </div>
        </div>
        {
          isNotEmptyFolder ? (
            <ul>
              {activeFolder?.subfolders.map(subfolder => (
                <ProjectNode key={subfolder.id} node={subfolder} type='folder' selectNode={onSelectNode}/>
              ))}

              {activeFolder?.plans.map(plan => (
                <ProjectNode key={plan.id} node={plan} type='plan' selectNode={onSelectNode}/>
              ))}
            </ul>
          ) : (

            <div className='text-center mt-12'>
              <p>Aucun dossier ou fichier.</p>
            </div>
          )
        }
          
        <div className="mt-12">
          <CTA color='primary' text='Fermer' type='button' onClick={closeFolders}/>
        </div>
      </div>
    </>
  )
}

export default ProjectFolders