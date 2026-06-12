
'use client';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { useProjectNodeStore } from '@/stores/ProjectNodesStore';
import { PlanType, ProjectType } from '@/types/project';
import { ArrowLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface TopBarProps {
  project?: ProjectType | null;
  plan?: PlanType | null;
}

function TopBar({ project, plan }: TopBarProps) {
  const openFolders = useProjectNodeStore((state) => state.open);
  const currentProjectTitle = useCurrentProjectStore((state) => state.currentProjectTitle);

  return (
    <div className="w-full bg-white text-black p-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <Link href={"/dashboard/projects"} className="block w-full">
        <div className="flex items-center gap-4">
          <ArrowLeft />
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl">{(project?.title || currentProjectTitle) || "Titre du projet"}</h3>
            <p className="text-gray-600 text-sm">Modifié le {project?.lastOpenedAt ? new Date(project.lastOpenedAt).toLocaleDateString() : 'Date non disponible'}</p>

          </div>
        </div>
      </Link>
      <div className="w-full flex items-center justify-end gap-2 cursor-pointer" onClick={openFolders}>
        <p>{plan ? plan.name : 'Aucun'}</p>
        <ChevronDown />
      </div>
    </div>
  )
}

export default TopBar