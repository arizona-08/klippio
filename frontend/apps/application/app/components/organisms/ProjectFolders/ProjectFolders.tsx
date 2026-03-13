'use client';

import { FileType, FolderType } from '@/types/project'
import { GripHorizontal } from 'lucide-react'
import React from 'react'
import ProjectNode from '../../molecules/ProjectNode/ProjectNode'


function ProjectFolders() {

  const projectNodes: Array<FileType | FolderType> = [
    {
      type: 'folder',
      id: 'fdvgbf',
      name : "Dossier 1",
      lastModified: new Date(),
      children: [
        {
          type: "folder",
          id: "dfnjksd",
          name: "Sous-dossier 1",
          lastModified: new Date(),
          children: [
            {
              type: "file",
              id: "fndskjfn",
              name: "Plan étage 1",
              lastModified: new Date()
            },
          ]
        }
      ]
    },
    {
      type: 'folder',
      id: 'fdvsdbfxgbf',
      name : "Dossier 2",
      lastModified: new Date()
    },
    {
      type: 'folder',
      id: 'fdvgbcgstf',
      name : "Dossier 3",
      lastModified: new Date()
    },
    {
      type: "folder",
      id: "fdscvdzgyrsafdf",
      name: "Dossier 4",
      lastModified: new Date()
    },
    {
      type: 'file',
      id: "fddbdfdxd",
      name: "Plan RDC",
      lastModified: new Date()
    },
  ]
  return (
    <>
      <div className="fixed inset-0 dark-layer bg-black/20 backdrop-blur-sm z-50"></div>
      <div className="fixed left-0 bottom-0 w-full h-150 bg-white p-4 rounded-t-lg z-50 md:max-w-150 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
      <div className="w-full flex items-center justify-center mb-2">
        <GripHorizontal className="text-gray-200"/>
      </div>
        <h2 className="text-xl font-semibold mb-4">Sélectionner un plan</h2>
        <ul className="">
          {projectNodes.map((node) => (
            <ProjectNode node={node} key={node.id}/>
          ))}
        </ul>
      </div>
    </>
  )
}

export default ProjectFolders