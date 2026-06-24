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
      <div className={`fixed inset-0 bg-black/25 z-40 backdrop-blur-sm ${isOverlayVisible ? 'block' : 'hidden'}`}></div>

      <div className={`w-full max-w-125 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ${isShareProjectModalVisible ? 'block' : 'hidden'}`}>
        <ShareProjectForm closeForm={() => useShareProjectModalStore.getState().closeShareProjectModal()}/>
      </div>
    </>
  )
}

export default ModalOverlay