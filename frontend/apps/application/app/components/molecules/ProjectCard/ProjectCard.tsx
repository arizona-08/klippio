import React from 'react'
import Image from 'next/image'
import ProjectManager from './ProjectManager';
import { ProjectType } from '@/types/project';
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore';
import { useRouter } from 'next/navigation';
import ProjectIsArchivedWarningModal from '../ProjectModals/ProjectIsArchivedWarningModal';

interface ProjectCardProps {
  project: ProjectType;
  mode: 'basic' | 'archive';
  handleUnarchiveProject: (projectIdToUnarchive: string | null, projectName: string | null) => Promise<void>;
}

function ProjectCard({ project, mode, handleUnarchiveProject }: ProjectCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const statusLabel = mode === 'archive' || project.isArchived ? 'Archive' : 'Actif';
  const statusClasses = statusLabel === 'Archive'
    ? 'bg-gray-200 text-gray-700'
    : 'bg-emerald-100 text-emerald-700';
  const collaboratorsCount = project.collaborators?.length || 0;
  const activityDate = project.updatedAt || project.lastOpenedAt;
  const activityLabel = activityDate ? formatDate(activityDate) : 'Recemment';

  function openMenu(){
    setIsMenuOpen(true);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleCardClick() {
    if(project.isArchived){
      setIsModalVisible(true);
    } else {
      setCurrentProject(project);
      router.push(`/project/${project.id}/visualize`);
    }
  }

  const setCurrentProject = useCurrentProjectStore((state) => state.setCurrentProject);

  function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short'
    }).format(date);
  }

  const [isModalVisible, setIsModalVisible] = React.useState(false);

  async function handleUnarchive(){
    await handleUnarchiveProject(project.id, project.title);
    setIsModalVisible(false);
  }
  
  return (
    <>
      <ProjectIsArchivedWarningModal
        isVisible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
        handleUnarchiveProject={handleUnarchive}
      />
      <li className='w-full cursor-pointer border border-gray-200 rounded-xl p-4 hover:shadow-sm hover:scale-101 transition-all duration-150 relative hover:z-10 bg-white'>
        <div onClick={handleCardClick}>
          <div className="relative project-pic-container aspect-video rounded-lg mb-4 overflow-hidden bg-gray-200">
            {project.thumbnailUrl ? (
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-100" />
            )}

            <div className="absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-medium bg-white/90 text-gray-700">
              {statusLabel}
            </div>

            <div className="absolute top-3 right-3 bg-emerald-50 rounded-full px-2.5 py-1 text-emerald-700 text-xs text-center">
              <span className="font-medium">{project.numberOfPlans} Plans, {project.numberOfPhotos} Photos</span>
            </div>
          </div>

          <div className="project-infos-container">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <ProjectManager
                project={project}
                isMenuOpen={isMenuOpen}
                openMenu={openMenu}
                closeMenu={closeMenu}
              />
            </div>
            <p className="text-gray-700">{project.address}, {project.zipcode} {project.city}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 ${statusClasses}`}>
                {statusLabel}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1">
                {collaboratorsCount} {collaboratorsCount > 1 ? 'membres' : 'membre'}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1">
                Modifie le {activityLabel}
              </span>
            </div>
          </div>
        </div>
      </li>
    </>
  )
}

export default ProjectCard