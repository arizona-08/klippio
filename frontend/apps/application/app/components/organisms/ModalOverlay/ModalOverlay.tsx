'use client';
import React from 'react'
import DeleteProjectModal from '../../molecules/ProjectModals/DeleteProjectModal'
import { useDeleteProjectModalStore } from '@/stores/DeleteProjectModalStore'
import { useOverlayStore } from '@/stores/OverlayStore';
import ProjectForm from '../../molecules/ProjectForm/ProjectForm';
import { useModifyProjectStore } from '@/stores/ModifyProjectStore';
import { ProjectType } from '@/types/project';
import ShareProjectForm from '../../molecules/ShareProjectForm/ShareProjectForm';
import { useShareProjectModalStore } from '@/stores/ShareProjectModalStore';
import AddPlanModal from '../plan/AddPlanModal';
import { useAddPlanModalStore } from '@/stores/AddPlanModalStore';

function ModalOverlay() {
  const isOverlayVisible = useOverlayStore((state) => state.isOverlayOpen);

  const isDeleteProjectModalVisible = useDeleteProjectModalStore((state) => state.isDeleteProjectModalOpen);

  const isModifyProjectModalVisible = useModifyProjectStore((state) => state.isModifyProjectModalOpen);
  const projectToModify = useModifyProjectStore((state) => state.projectToModify) as ProjectType | undefined;

  const isShareProjectModalVisible = useShareProjectModalStore((state) => state.isShareProjectModalOpen);
  const isAddPlanModalVisible = useAddPlanModalStore((state) => state.isAddPlanModalOpen);

  return (
    <>
      <div className={`fixed inset-0 bg-black/25 z-40 backdrop-blur-sm ${isOverlayVisible ? 'block' : 'hidden'}`}></div>
      <DeleteProjectModal isVisible={isDeleteProjectModalVisible}/>

      <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50  ${isModifyProjectModalVisible ? 'block' : 'hidden'}`}>
        <ProjectForm edit={true} projectToEdit={projectToModify} closeForm={() => useOverlayStore.getState().closeOverlay()}/>
      </div>

      <div className={`w-full max-w-125 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ${isShareProjectModalVisible ? 'block' : 'hidden'}`}>
        <ShareProjectForm closeForm={() => useShareProjectModalStore.getState().closeShareProjectModal()}/>
      </div>

      {/* <div className={`w-full max-w-md m-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 ${isAddPlanModalVisible ? 'block' : 'hidden'}`}>
        <AddPlanModal />
      </div> */}
    </>
  )
}

export default ModalOverlay