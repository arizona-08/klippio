import { create } from "zustand";

interface UnarchiveProjectStoreState {
  projectToUnarchive: { id: string; name: string } | null;
  isProjectToUnarchiveModalOpen: boolean;
  openUnarchiveProjectModal: (projectId: string, projectName: string) => void;
  closeUnarchiveProjectModal: () => void;
}

export const useUnarchiveProjectStore = create<UnarchiveProjectStoreState>((set) => ({
  projectToUnarchive: null,
  isProjectToUnarchiveModalOpen: false,
  openUnarchiveProjectModal: (projectId: string, projectName: string) => set({ projectToUnarchive: { id: projectId, name: projectName }, isProjectToUnarchiveModalOpen: true }),
  closeUnarchiveProjectModal: () => set({ projectToUnarchive: null, isProjectToUnarchiveModalOpen: false }),
}));