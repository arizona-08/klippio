import { create } from "zustand";

type ModifyProjectStoreType = {
  isModifyProjectModalOpen: boolean;
  projectIdToModify: string | null;
  openModifyProjectModal: (projectId: string) => void;
  closeModifyProjectModal: () => void;
};

export const useModifyProjectStore = create<ModifyProjectStoreType>((set) => ({
  isModifyProjectModalOpen: false,
  projectIdToModify: null,
  openModifyProjectModal: (projectId) => set({ isModifyProjectModalOpen: true, projectIdToModify: projectId }),
  closeModifyProjectModal: () => set({ isModifyProjectModalOpen: false, projectIdToModify: null }),
}));