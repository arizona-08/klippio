import { ProjectType } from "@/types/project";
import { create } from "zustand";

export type CurrentProjectStore = {
  currentProject: ProjectType | null;
  currentProjectTitle: string | null;
  setCurrentProjectTitle: (title: string) => void;
  setCurrentProject: (project: ProjectType) => void;
};

export const useCurrentProjectStore = create<CurrentProjectStore>((set) => ({
  currentProject: null,
  currentProjectTitle: null,
  setCurrentProjectTitle: (title) => set({ currentProjectTitle: title }),
  setCurrentProject: (project) => set({ currentProject: project }),
}));