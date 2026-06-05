import { ProjectType } from "@/types/project";
import { create } from "zustand"

interface ShareProjectModalStoreType {
  isShareProjectModalOpen: boolean;
  projectToShare: ProjectType | null;
  openShareProjectModal: (projectToShare: ProjectType) => void;
  closeShareProjectModal: () => void;
}

export const useShareProjectModalStore = create<ShareProjectModalStoreType>((set) => ({
  isShareProjectModalOpen: false,
  projectToShare: null,
  openShareProjectModal: (projectToShare: ProjectType) => set({ isShareProjectModalOpen: true, projectToShare }),
  closeShareProjectModal: () => set({ isShareProjectModalOpen: false, projectToShare: null }),
}))