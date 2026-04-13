
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
    <div className="bg-gray-100 text-black p-4 flex items-center justify-between">
      <Link href={"/dashboard"}>
        <div className="flex items-center gap-4">
          <ArrowLeft />
          <h3>{(currentProject?.title || currentProjectTitle) || "Titre du projet"}</h3>
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