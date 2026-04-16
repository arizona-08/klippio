'use client';
import { useProjectNodeStore } from '@/stores/ProjectNodesStore';
import { FolderType, PlanType } from '@/types/project'
import { formatDate } from '@/utils/date';
import { EllipsisVertical, File, Folder } from 'lucide-react'
import React from 'react'
import ActionCard from './ActionCard';

interface ProjectNodeProps {
  type: 'folder' | 'plan';
  node: FolderType | PlanType
  selectNode: (node: FolderType | PlanType) => void ;
  handleOnDelete: (nodeId: string, type: 'folder' | 'plan') => void;
  handleOnRename: (nodeId: string, newName: string,  type: 'folder' | 'plan') => void;
}


function ProjectNode({ node, selectNode, type, handleOnDelete, handleOnRename }: ProjectNodeProps) {
  const [isActionCardOpen, setIsActionCardOpen] = React.useState(false);
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
        <EllipsisVertical onClick={() => setIsActionCardOpen(true)}/>
      </div>

      <ActionCard
        isActionCardOpen={isActionCardOpen}
        onDelete={() => handleOnDelete(node.id, type)}
        onRename={() => handleOnRename(node.id, node.name, type)}
        closeActionCard={() => setIsActionCardOpen(false)}
      />
    </li>
  )
}

export default ProjectNode