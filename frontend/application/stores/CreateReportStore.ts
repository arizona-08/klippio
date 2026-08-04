import { create } from "zustand";

export type CreateReportStore = {
  isCreateReportModalOpen: boolean;
  openCreateReportModal: () => void;
  closeCreateReportModal: () => void;
}

export const useCreateReportStore = create<CreateReportStore>((set) => ({
  isCreateReportModalOpen: false,
  openCreateReportModal: () => set({ isCreateReportModalOpen: true }),
  closeCreateReportModal: () => set({ isCreateReportModalOpen: false }),
}))