import React from 'react'
import { createPortal } from 'react-dom';
import CTA from '../../atoms/CTA';

interface RenameNodeModalProps {
  isRenameModalOpen: boolean;
  nodeId: string;
  currentName: string;
  type: 'folder' | 'plan';
  onRename: (nodeId: string, newName: string, type: 'folder' | 'plan') => void;
  closeRenameModal: () => void;
}
function RenameNodeModal({ isRenameModalOpen, nodeId, currentName, type, onRename, closeRenameModal }: RenameNodeModalProps) {
  const [newName, setNewName] = React.useState(currentName);

  function handleSubmit(e?: React.MouseEvent<HTMLButtonElement | MouseEvent>) {
    e?.preventDefault();
    onRename(nodeId, newName, type);
    closeRenameModal();
  }

  if (!isRenameModalOpen) return null;
  
  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/25 backdrop-blur-xl z-150"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-lg z-160 w-full max-w-110">
        <form className="flex flex-col gap-4" >
          <h3
            className="text-lg font-semibold"
            >Renommer {type === "folder" ? "le dossier" : "le plan"}
          </h3>
          <input type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-between">
            <CTA
              color='secondary'
              type='button'
              text='Annuler'
              onClick={closeRenameModal}
            />

            <CTA
              color='primary'
              type='button'
              text='Renommer'
              onClick={handleSubmit}
            />
          </div>
        </form>
      </div>
    </>, document.body
  )
}

export default RenameNodeModal