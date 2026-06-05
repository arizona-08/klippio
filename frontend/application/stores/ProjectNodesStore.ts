import { create } from "zustand";

type ProjectNodeStore = {
  isOpen: boolean;
  close: () => void;
  open: () => void;
}

export const useProjectNodeStore = create<ProjectNodeStore>((set) => ({
  isOpen: false,
  close: () => set({isOpen: false}),
  open: () => set({isOpen: true})
}))