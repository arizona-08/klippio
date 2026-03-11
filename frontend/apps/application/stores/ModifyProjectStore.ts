import { ProjectType } from "@/types/project";
import { create } from "zustand";

type ModifyProjectStoreType = {
  isModifyProjectModalOpen: boolean;
  projectToModify: ProjectType | null;
  openModifyProjectModal: (project: ProjectType) => void;
  closeModifyProjectModal: () => void;
};

export const useModifyProjectStore = create<ModifyProjectStoreType>((set) => ({
  isModifyProjectModalOpen: false,
  projectToModify: null,
  openModifyProjectModal: (project) => set({ isModifyProjectModalOpen: true, projectToModify: project }),
  closeModifyProjectModal: () => set({ isModifyProjectModalOpen: false, projectToModify: null }),
}));