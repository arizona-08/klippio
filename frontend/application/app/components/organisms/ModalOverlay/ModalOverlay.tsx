'use client';
import React from 'react'
import { useOverlayStore } from '@/stores/OverlayStore';
import ShareProjectForm from '../../molecules/ShareProjectForm/ShareProjectForm';
import { useShareProjectModalStore } from '@/stores/ShareProjectModalStore';


function ModalOverlay() {
  const isOverlayVisible = useOverlayStore((state) => state.isOverlayOpen);
  const isShareProjectModalVisible = useShareProjectModalStore((state) => state.isShareProjectModalOpen);

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-sm ${isOverlayVisible || isShareProjectModalVisible ? 'block' : 'hidden'}`}></div>

      <div className={`fixed left-1/2 top-1/2 z-50 max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-125 -translate-x-1/2 -translate-y-1/2 overflow-y-auto ${isShareProjectModalVisible ? 'block' : 'hidden'}`}>
        <ShareProjectForm closeForm={() => useShareProjectModalStore.getState().closeShareProjectModal()}/>
      </div>
    </>
  )
}

export default ModalOverlay
