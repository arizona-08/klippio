'use client';
import { FolderType, PlanType } from '@/types/project'
import { formatDate } from '@/utils/date';
import { EllipsisVertical, File, Folder } from 'lucide-react'
import React from 'react'
import ActionCard from './ActionCard';
import RenameNodeModal from '../../organisms/ProjectFolders/RenameNodeModal';

interface ProjectNodeProps {
  type: 'folder' | 'plan';
  node: FolderType | PlanType
  handleOnDelete: (nodeId: string, type: 'folder' | 'plan') => void;
  handleOnRename: (nodeId: string, newName: string,  type: 'folder' | 'plan') => void;
  navigateToFolder?: (folderId: string) => void;
  loadPlan?: (planId: string) => void;
}


function ProjectNode({ node, type, handleOnDelete, handleOnRename, navigateToFolder, loadPlan }: ProjectNodeProps) {
  const [isActionCardOpen, setIsActionCardOpen] = React.useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  return (
    <>
      <RenameNodeModal
        nodeId={node.id}
        isRenameModalOpen={isRenameModalOpen}
        currentName={node.name}
        type={type}
        onRename={handleOnRename}
        closeRenameModal={() => setIsRenameModalOpen(false)}
      />
      <li
        className="relative w-full h-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
        onClick={() => {
          if(type === "folder") {
            navigateToFolder?.(node.id);
          } else {
            loadPlan?.(node.id);
          }
          
        }}
      >
        <div className="flex gap-4 items-center">
          {type === 'folder' ? <Folder className="text-primary fill-primary"/> : <File className="text-gray-400"/>}
          <div className="">
            <p className="text-lg font-medium leading-tight">{node.name}</p>
            <p>Modifié le {type === 'folder' ? formatDate((node as FolderType).lastModifiedAt) || '' : formatDate((node as PlanType).lastOpenedAt) || ''}</p>
          </div>
        </div>

        {/* dots & folder actions*/}
        <div className="" onClick={(e) => {
          e.stopPropagation();
          setIsActionCardOpen(true)
          }}
          ref={triggerRef}
        >
          <EllipsisVertical />
        </div>

        <ActionCard
          isActionCardOpen={isActionCardOpen}
          onDelete={() => handleOnDelete(node.id, type)}
          showRenameModal={() => {
            setIsRenameModalOpen(true);
            setIsActionCardOpen(false);
          }}
          closeActionCard={() => setIsActionCardOpen(false)}
          triggerRef={triggerRef}
        />
      </li>
    </>
  )
}

export default ProjectNode