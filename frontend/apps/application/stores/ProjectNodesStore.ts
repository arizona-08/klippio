import { FileType, FolderType } from "@/types/project";
import { create } from "zustand";

type ProjectNodeStore = {
  isOpen: boolean;
  selectedNode: FileType | FolderType | null;
  navigationHistory: Array<FolderType>;

  setSelectedNode: (node: FileType | FolderType | null) => void;
  navigateIntoFolder: (folder: FolderType) => void;
  navigateBack: () => void;

  clearNode: () => void;
  close: () => void;
  open: () => void;
}

export const useProjectNodeStore = create<ProjectNodeStore>((set) => ({
  isOpen: false,
  selectedNode : null,
  navigationHistory: [],

  setSelectedNode: (node) => set({selectedNode: node}),
  
  // Quand on clique sur un dossier pour l'ouvrir
  navigateIntoFolder: (folder) => set((currentState) => ({
    selectedNode: folder,
    navigationHistory: [...currentState.navigationHistory, folder]
  })),

  // Quand on veut remonter d'un niveau
  navigateBack: () => set((currentState) => {
    // S'il n'y a qu'un seul élément (la racine), on ne peut pas reculer
    if (currentState.navigationHistory.length <= 1) {
      return currentState;
    }

    // On crée une copie du tableau et on retire le dernier élément
    const updatedHistory = [...currentState.navigationHistory];
    updatedHistory.pop();

    // Le nouveau noeud actif est le dernier élément restant dans l'historique
    const previousFolder = updatedHistory[updatedHistory.length - 1];

    return {
      selectedNode: previousFolder,
      navigationHistory: updatedHistory
    };
  }),

  clearNode: () => set({selectedNode: null}),
  close: () => set({isOpen: false}),
  open: () => set({isOpen: true})
}))