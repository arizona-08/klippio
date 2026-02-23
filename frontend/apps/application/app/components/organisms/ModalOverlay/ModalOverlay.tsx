'use client';
import React from 'react'
import DeleteProjectModal from '../../molecules/ProjectModals/DeleteProjectModal'
import { useDeleteProjectModalStore } from '@/stores/DeleteProjectModalStore'
import { useOverlayStore } from '@/stores/OverlayStore';
import ProjectForm from '../../molecules/ProjectForm/ProjectForm';
import { useModifyProjectStore } from '@/stores/ModifyProjectStore';
import { ProjectType } from '@/types/project';

function ModalOverlay() {
  const isOverlayVisible = useOverlayStore((state) => state.isOverlayOpen);

  const isDeleteProjectModalVisible = useDeleteProjectModalStore((state) => state.isDeleteProjectModalOpen);
  const isModifyProjectModalVisible = useModifyProjectStore((state) => state.isModifyProjectModalOpen);
  const projectToModify = useModifyProjectStore((state) => state.projectToModify) as ProjectType | undefined;

  return (
    <>
      <div className={`fixed inset-0 bg-black/25 z-40 backdrop-blur-sm ${isOverlayVisible ? 'block' : 'hidden'}`}></div>
      <DeleteProjectModal isVisible={isDeleteProjectModalVisible}/>

      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50  ${isModifyProjectModalVisible ? 'block' : 'hidden'}`}>
        <ProjectForm edit={true} projectToEdit={projectToModify} closeForm={() => useOverlayStore.getState().closeOverlay()}/>
      </div>
    </>
  )
}

export default ModalOverlay