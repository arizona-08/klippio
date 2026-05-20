import { create } from "zustand";

interface ArchiveProjectStoreState {
  projectToArchive: { id: string; name: string } | null;
  isProjectToArchiveModalOpen: boolean;
  openArchiveProjectModal: (projectId: string, projectName: string) => void;
  closeArchiveProjectModal: () => void;
}

export const useArchiveProjectStore = create<ArchiveProjectStoreState>((set) => ({
  projectToArchive: null,
  isProjectToArchiveModalOpen: false,
  openArchiveProjectModal: (projectId: string, projectName: string) => set({ projectToArchive: { id: projectId, name: projectName }, isProjectToArchiveModalOpen: true }),
  closeArchiveProjectModal: () => set({ projectToArchive: null, isProjectToArchiveModalOpen: false }),
}));