import { FileType, FolderType } from "@/types/project";
import { create } from "zustand";

type ProjectNodeStore = {
  isOpen: boolean;
  selectedNode: FileType | FolderType | null;
  setSelectedNode: (node: FileType | FolderType) => void;
  clearNode: () => void;
  close: () => void;
  open: () => void;
}

export const useProjectNodeStore = create<ProjectNodeStore>((set) => ({
  isOpen: false,
  selectedNode : null,
  setSelectedNode: (node) => set({selectedNode: node}),
  clearNode: () => set({selectedNode: null}),
  close: () => set({isOpen: false}),
  open: () => set({isOpen: true})
}))