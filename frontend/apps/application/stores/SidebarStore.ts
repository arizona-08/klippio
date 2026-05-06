import { create } from "zustand";

interface SidebarStoreType {
  isSidebarOpen: boolean;
  isVisibleAndOpen: boolean;
  viewportWidth: number | null;
  setViewportWidth: (width: number) => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const LG_BREAKPOINT = 1024;

export const useSidebarStore = create<SidebarStoreType>((set) => ({
  isSidebarOpen: true,
  isVisibleAndOpen: true,
  viewportWidth: null,
  setViewportWidth: (width) =>
    set((state) => ({
      viewportWidth: width,
      isVisibleAndOpen: state.isSidebarOpen && width >= LG_BREAKPOINT,
    })),
  toggleSidebar: () =>
    set((state) => {
      const nextOpen = !state.isSidebarOpen;
      return {
        isSidebarOpen: nextOpen,
        isVisibleAndOpen: nextOpen &&
          (state.viewportWidth === null || state.viewportWidth >= LG_BREAKPOINT),
      };
    }),
  openSidebar: () =>
    set((state) => ({
      isSidebarOpen: true,
      isVisibleAndOpen: state.viewportWidth === null || state.viewportWidth >= LG_BREAKPOINT,
    })),
  closeSidebar: () => set({ isSidebarOpen: false, isVisibleAndOpen: false }),
}))