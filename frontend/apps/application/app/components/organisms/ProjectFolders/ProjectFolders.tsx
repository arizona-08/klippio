'use client';

import { FileType, FolderType } from '@/types/project'
import { ArrowLeft, GripHorizontal } from 'lucide-react'
import React, { useEffect } from 'react'
import ProjectNode from '../../molecules/ProjectNode/ProjectNode'
import { CTA } from '@repo/ui';
import { useProjectNodeStore } from '@/stores/ProjectNodesStore';

const projectRoot: FolderType =  {
    type: 'root',
    id: 'fdvgbf',
    name : "Root",
    lastModified: new Date(),
    children: [
      {
        type: "folder",
        parentId: "fdvgbf",
        id: "dfnjksd",
        name: "Sous-dossier 1",
        lastModified: new Date(),
        children: [
          {
            type: 'folder',
            id: 'sgdsdfhgtr',
            name : "Sous-dossier 2",
            lastModified: new Date(),
          },
          {
            type: "file",
            id: "fndskjfn",
            name: "Plan étage 1",
            lastModified: new Date(),
            parentId: "dfnjksd"
          },
        ]
      },
      {
        type: 'folder',
        id: 'fdvsdbfxgbf',
        name : "Dossier 2",
        lastModified: new Date(),
      },
      {
        type: 'folder',
        id: 'fdvgbcgstf',
        name : "Dossier 3",
        lastModified: new Date(),

      },
      {
        type: "folder",
        id: "fdscvdzgyrsafdf",
        name: "Dossier 4",
        lastModified: new Date(),

      },
      {
        type: 'file',
        id: "fddbdfdxd",
        name: "Plan RDC",
        lastModified: new Date(),
      },
    ]
  }

function ProjectFolders() {


  const isProjectsFolderModalOpen = useProjectNodeStore((state) => state.isOpen);
  const closeFolders = useProjectNodeStore((state) => state.close);
  const setSelectedNode = useProjectNodeStore((state) => state.setSelectedNode);
  const selectedNode = useProjectNodeStore((state) => state.selectedNode);
  const navigationHistory = useProjectNodeStore((state) => state.navigationHistory);
  
  const navigateIntoFolder = useProjectNodeStore((state) => state.navigateIntoFolder);
  const navigateBack = useProjectNodeStore((state) => state.navigateBack);

  useEffect(() => {
    if (!selectedNode && navigationHistory.length === 0) {
      navigateIntoFolder(projectRoot);
    }
  }, [selectedNode, navigationHistory, navigateIntoFolder])

  function onSetNode(node: FileType | FolderType){
    if (node.type === 'folder' || node.type === 'root') {
      // Si c'est un dossier, on plonge dedans et on l'ajoute à l'historique
      navigateIntoFolder(node as FolderType);
    } else {
      // Si c'est un fichier, on pourrait ouvrir une modale de prévisualisation
      console.log("Ouverture du fichier :", node.name);
    }
  }

  return (
    <>
      <div className={`fixed inset-0 dark-layer bg-black/20 backdrop-blur-sm z-50 ${isProjectsFolderModalOpen ? 'block' : 'hidden'}`}></div>
      <div className={`fixed left-0 bottom-0 w-full h-150 bg-white py-8 px-4 rounded-t-lg z-50 md:max-w-150 md:h-fit md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 ${isProjectsFolderModalOpen ? 'block' : 'hidden'}`}>
        {/* <div className="w-full flex items-center justify-center mb-2">
          <GripHorizontal className="text-gray-200"/>
        </div> */}
        <div className="mb-4 ">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateBack()}>
            <ArrowLeft className={`${selectedNode && selectedNode.type !== "root" ? 'block' : 'hidden'}`}/>
            <h2 className="text-xl font-semibold ">{selectedNode && selectedNode.type === "folder" ? selectedNode.name : 'Sélectionner un plan'}</h2>
          </div>
        </div>
        {selectedNode && (selectedNode.type === 'folder' || selectedNode.type === 'root') && (!selectedNode.children || selectedNode.children.length === 0) ? (
          <div className='text-center mt-12'>
            <p>Aucun dossier ou fichier.</p>
          </div>
        ) : (
          <ul className="">
            {selectedNode && (selectedNode.type === 'folder' || selectedNode.type === 'root') && selectedNode.children?.map((node) => (
              <ProjectNode node={node} key={node.id} setNode={onSetNode} />
            ))}
          </ul>
        )}
        

        <div className="mt-12">
          <CTA color='primary' text='Fermer' type='button' onClick={closeFolders}/>
        </div>
      </div>
    </>
  )
}

export default ProjectFolders