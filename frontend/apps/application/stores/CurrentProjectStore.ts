import { ProjectType } from "@/types/project";
import { create } from "zustand";

export type CurrentProjectStore = {
  currentProject: ProjectType | null;
  setCurrentProject: (project: ProjectType) => void;
};

export const useCurrentProjectStore = create<CurrentProjectStore>((set) => ({
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
}));