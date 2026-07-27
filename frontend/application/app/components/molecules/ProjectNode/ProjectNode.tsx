'use client';
import { FolderType, PlanType } from '@/types/project'
import { formatDate } from '@/utils/date';
import { EllipsisVertical, File, Folder } from 'lucide-react'
import React from 'react'
import ActionCard from './ActionCard';
import RenameNodeModal from '../../organisms/ProjectFolders/RenameNodeModal';
import DeleteNodeModal from '../../organisms/ProjectFolders/DeleteNodeModal';

interface ProjectNodeProps {
  type: 'folder' | 'plan';
  node: FolderType | PlanType
  handleOnDelete: (nodeId: string, type: 'folder' | 'plan') => Promise<void>;
  handleOnRename: (nodeId: string, newName: string,  type: 'folder' | 'plan') => void;
  navigateToFolder?: (folderId: string) => void;
  loadPlan?: (planId: string) => void;
  canEdit: boolean;
}


function ProjectNode({ node, type, handleOnDelete, handleOnRename, navigateToFolder, loadPlan, canEdit }: ProjectNodeProps) {
  const [isActionCardOpen, setIsActionCardOpen] = React.useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      {canEdit && <RenameNodeModal
        nodeId={node.id}
        isRenameModalOpen={isRenameModalOpen}
        currentName={node.name}
        type={type}
        onRename={handleOnRename}
        closeRenameModal={() => setIsRenameModalOpen(false)}
      />}
      {canEdit && <DeleteNodeModal
        isOpen={isDeleteModalOpen}
        nodeId={node.id}
        nodeName={node.name}
        type={type}
        onDelete={handleOnDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />}
      <li
        className="relative flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary/5 cursor-pointer"
        onClick={() => {
          if(type === "folder") {
            navigateToFolder?.(node.id);
          } else {
            loadPlan?.(node.id);
          }
          
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${type === 'folder' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
            {type === 'folder' ? <Folder className="h-4 w-4 fill-current"/> : <File className="h-4 w-4"/>}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight text-gray-900">{node.name}</p>
            <p className="mt-1 text-xs text-gray-500">Modifié le {type === 'folder' ? formatDate((node as FolderType).lastModifiedAt) || '' : formatDate((node as PlanType).lastOpenedAt) || ''}</p>
          </div>
        </div>

        {/* dots & folder actions*/}
        {canEdit && <button type="button" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white hover:text-gray-900" onClick={(e) => {
          e.stopPropagation();
          setIsActionCardOpen(true)
          }}
          ref={triggerRef}
        >
          <EllipsisVertical className="h-4 w-4" />
        </button>}

        {canEdit && <ActionCard
          isActionCardOpen={isActionCardOpen}
          onDelete={() => {
            setIsDeleteModalOpen(true);
            setIsActionCardOpen(false);
          }}
          showRenameModal={() => {
            setIsRenameModalOpen(true);
            setIsActionCardOpen(false);
          }}
          closeActionCard={() => setIsActionCardOpen(false)}
          triggerRef={triggerRef}
        />}
      </li>
    </>
  )
}

export default ProjectNode
