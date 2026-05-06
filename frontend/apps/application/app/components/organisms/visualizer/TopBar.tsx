
'use client';
import { usePlanStore } from '@/stores/AllPlansStore';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { useProjectNodeStore } from '@/stores/ProjectNodesStore';
import { ArrowLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function TopBar() {
  const currentPlan = usePlanStore((state) => state.currentPlan);
  const openFolders = useProjectNodeStore((state) => state.open);

  const currentProject = useCurrentProjectStore((state) => state.currentProject);
  const currentProjectTitle = useCurrentProjectStore((state) => state.currentProjectTitle);

  return (
    <div className="bg-white text-black p-4 flex items-center justify-between">
      <Link href={"/dashboard/projects"}>
        <div className="flex items-center gap-4">
          <ArrowLeft />
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl">{(currentProject?.title || currentProjectTitle) || "Titre du projet"}</h3>
            <p className="text-gray-600 text-sm">Modifié le {currentProject?.lastOpenedAt ? new Date(currentProject.lastOpenedAt).toLocaleDateString() : 'Date non disponible'}</p>

          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2 cursor-pointer" onClick={openFolders}>
        <p>{currentPlan ? currentPlan.name : 'Aucun'}</p>
        <ChevronDown />
      </div>
    </div>
  )
}

export default TopBar