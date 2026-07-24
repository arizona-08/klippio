'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import CTA from '../../atoms/CTA';

interface DeleteNodeModalProps {
  isOpen: boolean;
  nodeId: string;
  nodeName: string;
  type: 'folder' | 'plan';
  onDelete: (nodeId: string, type: 'folder' | 'plan') => Promise<void>;
  onClose: () => void;
}

function DeleteNodeModal({
  isOpen,
  nodeId,
  nodeName,
  type,
  onDelete,
  onClose,
}: DeleteNodeModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    await onDelete(nodeId, type);
    setIsDeleting(false);
    onClose();
  }

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-150 bg-black/25 backdrop-blur-sm" />
      <div className="fixed left-1/2 top-1/2 z-160 w-full max-w-110 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
        <p className="mt-3 text-sm text-gray-600">
          Êtes-vous sûr de vouloir supprimer {type === 'plan' ? 'le plan' : 'le dossier'} &quot;{nodeName}&quot; ? Cette action est irréversible.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <CTA color="secondary" type="button" text="Annuler" onClick={onClose} />
          <button
            type="button"
            className="rounded-md bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}

export default DeleteNodeModal;
