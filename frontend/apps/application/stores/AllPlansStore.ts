import { PlanType } from "@/types/project";
import { create } from "zustand";

export type AllPlansStoreType = {
  plans: PlanType[];
  addPlan: (plan: PlanType) => void;
  removePlan: (index: number) => void;
  clearPlans: () => void;
}

export const useAllPlansStore = create<AllPlansStoreType>((set) => ({
  plans: [],
  addPlan: (plan: PlanType) => set((state) => ({ plans: [...state.plans, plan] })),
  removePlan: (index: number) => set((state) => ({ plans: state.plans.filter((_, i) => i !== index) })),
  clearPlans: () => set({ plans: [] }),
}));