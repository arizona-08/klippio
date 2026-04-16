import React from 'react'

interface ActionCardProps {
  isActionCardOpen: boolean;
  onRename: () => void;
  onDelete: () => void;
  closeActionCard: () => void;
}
function ActionCard({ isActionCardOpen, onRename, onDelete, closeActionCard }: ActionCardProps) {
  
  React.useEffect(() => {
    function handleClickOutsideMenu(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.actionCardMenu')) {
        closeActionCard();
      }
    }

    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, []);

  return (
    <div
        className={`actionCardMenu absolute top-4 right-8 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-2 w-32 ${isActionCardOpen ? 'opacity-100 visible -top-9 z-10 block' : 'opacity-0 invisible top-14 hidden' } transition-all duration-150`}
        onClick={(e) => e.stopPropagation()}  
      >
        <ul className="flex flex-col gap-2">
          <li className="text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); onRename(); }}>Renommer</li>
          <li className="text-sm text-red-500 hover:bg-red-100 rounded-md px-2 py-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); onDelete(); }}>Supprimer</li>
        </ul>
      </div>
  )
}

export default ActionCard