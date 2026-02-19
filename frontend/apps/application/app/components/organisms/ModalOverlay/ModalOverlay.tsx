'use client';
import React from 'react'
import DeleteProjectModal from '../../molecules/ProjectModals/DeleteProjectModal'
import { useDeleteProjectModalStore } from '@/stores/DeleteProjectModalStore'
import { useOverlayStore } from '@/stores/OverlayStore';

function ModalOverlay() {
  const isOverlayVisible = useOverlayStore((state) => state.isOverlayOpen);

  const isDeleteProjectModalVisible = useDeleteProjectModalStore((state) => state.isDeleteProjectModalOpen);
  return (
    <>
      <div className={`fixed inset-0 bg-black/25 z-40 backdrop-blur-sm ${isOverlayVisible ? 'block' : 'hidden'}`}></div>
      <DeleteProjectModal isVisible={isDeleteProjectModalVisible}/>
    </>
  )
}

export default ModalOverlay