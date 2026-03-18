import { DiamondPlus, Hand, ListFilter, MapPin } from 'lucide-react';
import React from 'react'

export type SelectOption = 'hand' | 'pin' | 'filter' | 'add';
interface VisualizerMenuProps {
  option: SelectOption;
  selectOption: (option: SelectOption) => void;
}

function VisualizerMenu({ option, selectOption }: VisualizerMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function toggleMenu() {
    setIsMenuOpen(prev => !prev);
  }

  return (
    <div className={`w-12 rounded-full bg-gray-200 px-2 py-4 flex flex-col items-center justify-center cursor-pointer fixed bottom-12 right-5 z-50 ${isMenuOpen ? 'h-55' : 'h-12'} transition-all duration-150 overflow-hidden`}>
      <div className={`w-full elements flex flex-col items-center gap-2 h-50 ${isMenuOpen ? 'opacity-100 flex-1' : 'opacity-0 hidden'} transition-all duration-150`}>
        <div className={`hover:bg-gray-300 p-1 rounded-full ${option === 'hand' ? 'bg-gray-300' : ''}`} onClick={() => selectOption('hand')}>
          <Hand />
        </div>
        <div className={`hover:bg-gray-300 p-1 rounded-full ${option === 'pin' ? 'bg-gray-300' : ''}`} onClick={() => selectOption('pin')}>
          <MapPin />
        </div>
        <div className={`hover:bg-gray-300 p-1 rounded-full ${option === 'filter' ? 'bg-gray-300' : ''}`} onClick={() => selectOption('filter')}>
          <ListFilter />
        </div>
        <div className={`hover:bg-gray-300 p-1 rounded-full ${option === 'add' ? 'bg-gray-300' : ''}`} onClick={() => selectOption('add')}>
          <DiamondPlus />
        </div>
      </div>
  
      <div className={`burgerMenu absolute bottom-4 h-4 w-12 cursor-pointer `} onClick={toggleMenu}>
        <span className={`absolute left-2.5 w-3/5 h-0.5 bg-black ${isMenuOpen ? 'top-1/2 rotate-45' : 'top-0'} transition-all duration-150`}></span>
        <span className={`absolute left-2.5 w-3/5 h-0.5 bg-black ${isMenuOpen ? 'top-1/2 -rotate-45' : 'top-1/2'} transition-all duration-150`}></span>
        <span className={`absolute left-2.5 w-3/5 h-0.5 bg-black ${isMenuOpen ? 'opacity-0 hidden' : 'opacity-full top-full'} transition-all duration-150`}></span>
      </div>
    </div>
  )
}

export default VisualizerMenu