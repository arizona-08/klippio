
'use client';
import { useCreateReportStore } from '@/stores/CreateReportStore';
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { useProjectNodeStore } from '@/stores/ProjectNodesStore';
import { useOverlayStore } from '@/stores/OverlayStore';
import { useShareProjectModalStore } from '@/stores/ShareProjectModalStore';
import { PlanType, ProjectType } from '@/types/project';
import { ArrowLeft, ChevronDown, EllipsisVertical, FileText, Share } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface TopBarProps {
  project?: ProjectType | null;
  plan?: PlanType | null;
}

function TopBar({ project, plan }: TopBarProps) {
  const { user } = useUser();
  const openFolders = useProjectNodeStore((state) => state.open);
  const currentProjectTitle = useCurrentProjectStore((state) => state.currentProjectTitle);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const openCreateReportModal = useCreateReportStore((state) => state.openCreateReportModal);
  const openOverlay = useOverlayStore((state) => state.openOverlay);
  const openShareProjectModal = useShareProjectModalStore(
    (state) => state.openShareProjectModal,
  );

  const canShareProject = project?.authorId === user?.id;

  function handleOpenShareProjectModal() {
    if (!project || !canShareProject) return;

    openShareProjectModal(project);
    openOverlay();
    setIsMenuOpen(false);
  }

  return (
    <header className="flex w-full flex-col gap-3 border-b border-black/8 bg-white px-4 py-3 text-black shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
        <Link
          href="/dashboard/projects"
          className="group flex min-w-0 items-center gap-3 rounded-lg py-1 transition-colors hover:text-primary"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{(project?.title || currentProjectTitle) || "Projet sans titre"}</p>
            <p className="mt-0.5 text-xs text-gray-500">Retour aux projets</p>
          </div>
        </Link>

        {/* actions menu */}
        <div className="relative">
          <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-all" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <EllipsisVertical className="h-5 w-5"/>
          </div>

          {/* menu */}
          {isMenuOpen && (
            <div className="absolute left-0 top-full z-40 mt-2 w-48 border border-gray-200 rounded-md bg-white shadow-lg">
              <div>
                {canShareProject && (
                  <button
                    type="button"
                    className="flex w-full gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleOpenShareProjectModal}
                  >
                    <Share className="h-4 w-4" /> Partager
                  </button>
                )}
                
                <button
                  className="flex gap-2 w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    openCreateReportModal();
                    setIsMenuOpen(false);
                  }}
                >
                  <FileText className="h-4 w-4" /> Exporter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={openFolders}
        className="group flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left transition-all hover:border-primary/30 hover:bg-white hover:shadow-sm sm:max-w-md"
        aria-label="Choisir un plan"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-medium uppercase tracking-wide text-gray-500">Plan affiché</span>
          <span className="block truncate text-sm font-semibold text-gray-900">{plan ? plan.name : 'Choisir un plan'}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-hover:translate-y-0.5" />
      </button>
    </header>
  )
}

export default TopBar
