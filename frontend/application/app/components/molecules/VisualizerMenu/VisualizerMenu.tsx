import { DiamondPlus, Hand, ListFilter, MapPin } from 'lucide-react';
import React from 'react'

export type SelectOption = 'hand' | 'pin' | 'filter' | 'add';
interface VisualizerMenuProps {
  option: SelectOption;
  selectOption: (option: SelectOption) => void;
}

function VisualizerMenu({ option, selectOption }: VisualizerMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(true);

  function toggleMenu() {
    setIsMenuOpen(prev => !prev);
  }

  return (
    <div className={`w-12 rounded-full bg-gray-50 border-2 border-gray-100 px-2 py-4 flex flex-col items-center justify-center cursor-pointer fixed bottom-12 right-5 z-50 ${isMenuOpen ? 'h-35' : 'h-12'} transition-all duration-150 overflow-hidden`}>
      <div className={`w-full elements flex flex-col items-center gap-2 h-50 ${isMenuOpen ? 'opacity-100 flex-1' : 'opacity-0 hidden'} transition-all duration-150`}>
        <div className={`hover:text-white hover:bg-primary p-1 rounded-full ${option === 'hand' ? 'bg-primary text-white' : ''}`} onClick={() => selectOption('hand')} title='Main libre'>
          <Hand className="stroke-1"/>
        </div>
        <div className={`hover:text-white hover:bg-primary p-1 rounded-full ${option === 'pin' ? 'bg-primary text-white' : ''}`} onClick={() => selectOption('pin')} title='Ajouter un marqueur'>
          <MapPin className="stroke-1"/>
        </div>
        {/* <div className={`hover:text-white hover:bg-primary p-1 rounded-full ${option === 'filter' ? 'bg-primary text-white' : ''}`} onClick={() => selectOption('filter')} title='Filtrer les marqueurs'>
          <ListFilter className="stroke-1"/>
        </div>
        <div className={`hover:text-white hover:bg-primary p-1 rounded-full ${option === 'add' ? 'bg-primary text-white' : ''}`} onClick={() => selectOption('add')} title='Ajouter un plan'>
          <DiamondPlus className="stroke-1"/>
        </div> */}
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