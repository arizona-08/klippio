import { CurrentPlanType, PlanTypeDto } from "@/types/project";
import { create } from "zustand";

export type PlanStoreType = {
  currentPlan: CurrentPlanType | null;
  setCurrentPlan: (plan: CurrentPlanType | null) => void;
}

export const usePlanStore = create<PlanStoreType>((set) => ({
  currentPlan: null,
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
}));