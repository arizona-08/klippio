'use client';
import React from 'react'

function ProjectManager() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  React.useEffect(() => {
    function handleClickOutsideMenu(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.projectManagerMenu')) {
        closeMenu();
      }
    }

    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, []);

  return (
    <div className="relative z-30">
      <div className=" flex flex-col items-end gap-1 w-4 cursor-pointer" onClick={() => setIsMenuOpen(true)}>
        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
        <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
      </div>

      <div className={`projectManagerMenu absolute  right-0  mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-32 ${isMenuOpen ? 'opacity-100 visible top-full' : 'opacity-0 invisible top-14' } transition-all duration-150 projectManagerMenu`}>
        <ul className="flex flex-col gap-2">
          <li className="text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 cursor-pointer">Modifier</li>
          <li className="text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 cursor-pointer">Partager</li>
          <li className="text-sm text-red-500 hover:bg-red-100 rounded-md px-2 py-1 cursor-pointer">Supprimer</li>
        </ul>
      </div>
    </div>
  )
}

export default ProjectManager