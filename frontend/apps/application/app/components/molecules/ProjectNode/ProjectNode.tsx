'use client';
import { useProjectNodeStore } from '@/stores/ProjectNodesStore';
import { FolderType, PlanType } from '@/types/project'
import { formatDate } from '@/utils/date';
import { EllipsisVertical, File, Folder } from 'lucide-react'
import React from 'react'

interface ProjectNodeProps {
  type: 'folder' | 'plan';
  node: FolderType | PlanType
  selectNode: (node: FolderType | PlanType) => void ;
}


function ProjectNode({ node, selectNode, type }: ProjectNodeProps) {

  return (
    <li className="relative w-full h-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer" onClick={() => selectNode(node)}>
      <div className="flex gap-4 items-center">
        {type === 'folder' ? <Folder className="text-primary fill-primary"/> : <File className="text-gray-400"/>}
        <div className="">
          <p className="text-lg font-medium leading-tight">{node.name}</p>
          <p>Modifié le {type === 'folder' ? formatDate((node as FolderType).lastModifiedAt) || '' : formatDate((node as PlanType).lastOpenedAt) || ''}</p>
        </div>
      </div>

      {/* dots & folder actions*/}
      <div className="">
        <EllipsisVertical />
      </div>
    </li>
  )
}

export default ProjectNode