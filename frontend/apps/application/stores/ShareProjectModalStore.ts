import { create } from "zustand"

interface ShareProjectModalStoreType {
  isShareProjectModalOpen: boolean;
  openShareProjectModal: () => void;
  closeShareProjectModal: () => void;
}

export const useShareProjectModalStore = create<ShareProjectModalStoreType>((set) => ({
  isShareProjectModalOpen: false,
  openShareProjectModal: () => set({ isShareProjectModalOpen: true }),
  closeShareProjectModal: () => set({ isShareProjectModalOpen: false }),
}))