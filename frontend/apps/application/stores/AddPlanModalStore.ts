import { create } from "zustand";

interface AddPlanType {
  isAddPlanModalOpen: boolean;
  openAddPlanModal: () => void;
  closeAddPlanModal: () => void;
}

export const useAddPlanModalStore = create<AddPlanType>((set) => ({
  isAddPlanModalOpen: true,
  openAddPlanModal: () => set({ isAddPlanModalOpen: true }),
  closeAddPlanModal: () => set({ isAddPlanModalOpen: false }),
}))