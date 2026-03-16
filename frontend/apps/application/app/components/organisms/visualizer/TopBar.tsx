
'use client';
import { useAllPlansStore } from '@/stores/AllPlansStore'
import { useProjectNodeStore } from '@/stores/ProjectNodesStore';
import { ArrowLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function TopBar() {
  const allPlans = useAllPlansStore((state) => state.plans);
  const openFolders = useProjectNodeStore((state) => state.open);

  return (
    <div className="bg-gray-100 text-black p-4 flex items-center justify-between">
      <Link href={"/dashboard"}>
        <div className="flex items-center gap-4">
          <ArrowLeft />
          <h3>Titre du projet</h3>
        </div>
      </Link>
      <div className="flex items-center gap-2 cursor-pointer" onClick={openFolders}>
        <p>{allPlans.length > 0 ? allPlans[0].name : 'Aucun'}</p>
        <ChevronDown />
      </div>
    </div>
  )
}

export default TopBar