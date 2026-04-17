import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ActionCardProps {
  isActionCardOpen: boolean;
  showRenameModal: () => void;
  onDelete: () => void;
  closeActionCard: () => void;
  triggerRef: React.RefObject<HTMLElement | null>; // Pass the ref of the button that opens it
}

function ActionCard({ isActionCardOpen, showRenameModal, onDelete, closeActionCard, triggerRef }: ActionCardProps) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    function handleClickOutsideMenu(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.actionCardMenu')) {
        closeActionCard();
      }
    }

    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, [closeActionCard]);

  // Update position when opened
  useLayoutEffect(() => {
    if (isActionCardOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY, // Position below the trigger
        left: rect.right + window.scrollX - 128, // Align right (128 is w-32)
      });
    }
  }, [isActionCardOpen, triggerRef]);

  if (!isActionCardOpen) return null;

  // Render the menu inside the body tag using createPortal
  return createPortal(
    <div
      className={`actionCardMenu absolute bg-white border border-gray-200 rounded-md shadow-lg p-2 w-32 z-120 ${isActionCardOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <ul className="flex flex-col gap-2">
        <li className="text-sm text-gray-700 hover:bg-gray-100 rounded-md px-2 py-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); showRenameModal(); }}>Renommer</li>
        <li className="text-sm text-red-500 hover:bg-red-100 rounded-md px-2 py-1 cursor-pointer" onClick={(e) => { e.stopPropagation(); onDelete(); }}>Supprimer</li>
      </ul>
    </div>,
    document.body
  );
}

export default ActionCard;