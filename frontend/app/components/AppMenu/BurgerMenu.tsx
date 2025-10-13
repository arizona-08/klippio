import React from 'react'

interface BurgerMenuProps{
  handleOnClick: () => void;
  isActive: boolean
}

function BurgerMenu({handleOnClick, isActive}: BurgerMenuProps) {
  return (
    <div className='min-w-6 min-h-5 cursor-pointer' onClick={handleOnClick}>
      <div className="burger-icon-container relative w-6 h-4 z-40">
        <span className={`inline-block w-full h-1 bg-slate-950 rounded-md absolute top-0 ${isActive ? 'active' : ''} transition-all`}></span>
        <span className={`inline-block w-full h-1 bg-slate-950 rounded-md absolute top-1/2 ${isActive ? 'active' : ''} transition-all`}></span>
        <span className={`inline-block w-full h-1 bg-slate-950 rounded-md absolute top-full ${isActive ? 'active' : ''} transition-all`}></span>
      </div>
    </div>
  )
}

export default BurgerMenu