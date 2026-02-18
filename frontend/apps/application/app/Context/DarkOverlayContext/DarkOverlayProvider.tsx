'use client';
import { createContext, useContext, useState } from 'react'

type DarkOverlayContextType = {
  isDarkOverlayVisible: boolean;
  setDarkOverlayVisible: (visible: boolean) => void;
}
const DarkOverlayContext = createContext<DarkOverlayContextType>({
  isDarkOverlayVisible: false,
  setDarkOverlayVisible: () => {}
});


interface DarkOverlayProviderProps {
  children: React.ReactNode
}

function DarkOverlayProvider({ children }: DarkOverlayProviderProps) {
  const [isDarkOverlayVisible, setDarkOverlayVisible] = useState(false);
  return (
    <DarkOverlayContext.Provider value={{ isDarkOverlayVisible, setDarkOverlayVisible }}>
      
    </DarkOverlayContext.Provider>
  )
}

export function useDarkOverlay() {
  const context = useContext(DarkOverlayContext);
  if (!context) {
    throw new Error('useDarkOverlay must be used within a DarkOverlayProvider');
  }
  return context;
}

export default DarkOverlayProvider