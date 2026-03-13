import React from 'react'

function VisualizerMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function toggleMenu() {
    setIsMenuOpen(prev => !prev);
  }

  return (
    <div className={`w-12 rounded-full bg-gray-200 px-2 py-4 flex flex-col items-center justify-center cursor-pointer fixed bottom-12 right-5 z-50 ${isMenuOpen ? 'h-45' : 'h-12'} transition-all duration-150 overflow-hidden`}>
      <div className={`w-full elements flex flex-col items-center gap-4 h-50 ${isMenuOpen ? 'opacity-100 flex-1' : 'opacity-0 hidden'} transition-all duration-150`}>
        <div className="bg-red-500 w-full h-5"></div>
        <div className="bg-red-500 w-full h-5"></div>
        <div className="bg-red-500 w-full h-5"></div>
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