import { FileType, FolderType } from '@/types/project'
import { EllipsisVertical, File, Folder } from 'lucide-react'
import React from 'react'

interface ProjectNodeProps {
  node: FileType | FolderType
}


function ProjectNode({ node }: ProjectNodeProps) {
  return (
    <li className="relative w-full h-full flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
      <div className="flex gap-4 items-center">
        {node.type === 'folder' ? <Folder className="text-primary fill-primary"/> : <File className="text-gray-400"/>}
        <div className="">
          <p className="text-lg font-medium leading-tight">{node.name}</p>
          <p>Modifié le {node.lastModified.toLocaleDateString()}</p>
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