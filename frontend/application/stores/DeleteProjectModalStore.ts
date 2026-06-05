import { create } from "zustand";

type DeleteProjectModalStore = {
  isDeleteProjectModalOpen: boolean;
  projectIdToDelete: string | null;
  openDeleteProjectModal: (projectId: string) => void;
  closeDeleteProjectModal: () => void;
}

export const useDeleteProjectModalStore = create<DeleteProjectModalStore>((set) => ({
  isDeleteProjectModalOpen: false,
  projectIdToDelete: null,
  openDeleteProjectModal: (projectId) => set({ isDeleteProjectModalOpen: true, projectIdToDelete: projectId }),
  closeDeleteProjectModal: () => set({ isDeleteProjectModalOpen: false, projectIdToDelete: null }),
}))