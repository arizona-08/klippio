import { create } from "zustand";

interface AddPlanTypeDto {
  isAddPlanModalOpen: boolean;
  openAddPlanModal: () => void;
  closeAddPlanModal: () => void;
}

export const useAddPlanModalStore = create<AddPlanTypeDto>((set) => ({
  isAddPlanModalOpen: true,
  openAddPlanModal: () => set({ isAddPlanModalOpen: true }),
  closeAddPlanModal: () => set({ isAddPlanModalOpen: false }),
}))