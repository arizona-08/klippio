import { create } from "zustand";

interface OverlayStore {
  isOverlayOpen: boolean;
  openOverlay: () => void;
  closeOverlay: () => void;
}

export const useOverlayStore = create<OverlayStore>((set) => ({
  isOverlayOpen: false,
  openOverlay: () => set({ isOverlayOpen: true }),
  closeOverlay: () => set({ isOverlayOpen: false }),
}))