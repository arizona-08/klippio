'use client';

import { FolderType, PlanType } from '@/types/project'
import { ArrowLeft, FilePlusCorner, FolderPlus, X } from 'lucide-react'
import React from 'react'
import ProjectNode from '../../molecules/ProjectNode/ProjectNode'

import { useProjectNodeStore } from '@/stores/ProjectNodesStore';
import CreateFolderModal from './CreateFolderModal';
import { createFolder, deleteFolder, renameFolder } from '@/proxy/folders/folder-functions';
import AddPlanModal from '../plan/AddPlanModal';
import { deletePlan, renamePlan } from '@/proxy/plan/plan-functions';
import { usePlanStore } from '@/stores/AllPlansStore';

interface ProjectFoldersProps {
  activeFolder: FolderType | null
  projectId: string;
  updateUIOnCreateFolder(newFolder: FolderType): void;
  updateUIOnAddPlan(newPlan: PlanType): void;
  updateUIOnDeleteNode(nodeId: string, type: 'folder' | 'plan'): void;
  updateUIOnRenameNode(nodeId: string, newName: string, type: 'folder' | 'plan'): void;
  triggerNavigateToFolder(folderId: string): void;
  triggerLoadPlan(planId: string): void;
  canEdit: boolean;
}

function ProjectFolders({ 
  activeFolder,
  projectId,
  updateUIOnCreateFolder,
  updateUIOnAddPlan,
  updateUIOnDeleteNode,
  updateUIOnRenameNode,
  triggerNavigateToFolder,
  triggerLoadPlan,
  canEdit,
}: ProjectFoldersProps)
{

  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = React.useState(false);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = React.useState(false);
  //fetch les infos de activeFolderId pour afficher le nom du dossier actif et son contenu (dossiers + plans)

  const isNotEmptyFolder = activeFolder ? (activeFolder.subfolders.length > 0 || activeFolder.plans.length > 0) : false;
  const isRootFolder = activeFolder ? activeFolder.isRoot : false;

  const isProjectsFolderModalOpen = useProjectNodeStore((state) => state.isOpen);
  const closeFolders = useProjectNodeStore((state) => state.close);

  const currentPlan = usePlanStore((state) => state.currentPlan);

  async function handleOnCreateFolder(folderName: string){
    const response = await createFolder(folderName, projectId, activeFolder ? activeFolder.id : null);

    if(!response.ok){
      console.error("Failed to create folder");
      return;
    }

    const result = await response.json();
    const createdFolder = result;
    updateUIOnCreateFolder(createdFolder);
    setIsCreateFolderModalOpen(false);

  }

  function onNavigateToFolder(folderId: string){
    triggerNavigateToFolder(folderId);
  }

  function onLoadPlan(planId: string){
    if(currentPlan && currentPlan.id !== planId){
      triggerLoadPlan(planId);
    }
    
    closeFolders();
  }

  async function onDeleteNode(nodeId: string, type: 'folder' | 'plan'){
    if(type === "folder") {
      const response = await deleteFolder(nodeId, projectId);

      if(!response.ok){
        console.error("Failed to delete folder");
        return;
      }

      updateUIOnDeleteNode(nodeId, type);
      return;
    }

    const response = await deletePlan(nodeId);

    if(!response.ok){
      console.error("Failed to delete plan");
      return;
    }

    updateUIOnDeleteNode(nodeId, type);
  }

  async function onRenameNode(nodeId: string, newName: string, type: 'folder' | 'plan'){
    const renameFunction = type === "folder" ? renameFolder : renamePlan;
    const response = await renameFunction(nodeId, newName, projectId);

      if(!response.ok){
        console.error("Failed to rename folder");
        return;
      }

      updateUIOnRenameNode(nodeId, newName, type);
  }

  return (
    <>
      <CreateFolderModal isOpen={isCreateFolderModalOpen} onClose={() => setIsCreateFolderModalOpen(false)} onCreate={handleOnCreateFolder}/>
      <AddPlanModal 
        isActive={isAddPlanModalOpen}
        projectId={projectId}
        activeFolderId={activeFolder ? activeFolder.id : undefined}
        onClose={() => setIsAddPlanModalOpen(false)}
        handleUploadPlan={() => {}}
        addPlanToList={updateUIOnAddPlan}
        createAndUploadPlan={false}
      />
      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 ${isProjectsFolderModalOpen ? 'block' : 'hidden'}`} onClick={closeFolders}></div>
      <div className={`fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl bg-white px-5 pb-5 pt-4 shadow-2xl md:left-1/2 md:top-1/2 md:w-full md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl ${isProjectsFolderModalOpen ? 'block' : 'hidden'}`}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {!isRootFolder && <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100" onClick={() => onNavigateToFolder(activeFolder?.parentId || '')} aria-label="Revenir au dossier parent"><ArrowLeft className="h-4 w-4"/></button>}
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Plans du projet</p>
              <h2 className="truncate text-lg font-semibold text-gray-900">{activeFolder?.name || 'Sélectionner un plan'}</h2>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {canEdit && <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10" onClick={() => setIsAddPlanModalOpen(true)} aria-label="Importer un plan"><FilePlusCorner className="h-5 w-5"/></button>}
            {canEdit && <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10" onClick={() => setIsCreateFolderModalOpen(true)} aria-label="Créer un dossier"><FolderPlus className="h-5 w-5"/></button>}
            <button type="button" className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100" onClick={closeFolders} aria-label="Fermer"><X className="h-5 w-5"/></button>
          </div>
        </div>
        {
          isNotEmptyFolder ? (
            <ul className="max-h-96 space-y-1 overflow-y-auto pr-1">
              {activeFolder?.subfolders.map(subfolder => (
                <ProjectNode
                  key={subfolder.id}
                  node={subfolder}
                  type='folder'
                  navigateToFolder={onNavigateToFolder}
                  handleOnDelete={onDeleteNode}
                  handleOnRename={onRenameNode}
                  canEdit={canEdit}
                />
              ))}

              {activeFolder?.plans.map(plan => (
                <ProjectNode
                  key={plan.id}
                  node={plan}
                  type='plan'
                  loadPlan={onLoadPlan}
                  handleOnDelete={onDeleteNode}
                  handleOnRename={onRenameNode}
                  canEdit={canEdit}
                />
              ))}
            </ul>
          ) : (
            <div className='rounded-xl bg-gray-50 px-4 py-10 text-center'>
              <p className="text-sm font-medium text-gray-700">Ce dossier est vide.</p>
              {canEdit && <p className="mt-1 text-xs text-gray-500">Importez un plan ou créez un dossier pour commencer.</p>}
            </div>
          )
        }
      </div>
    </>
  )
}

export default ProjectFolders
