import { getArchivedProjectsServerSide, getProjectsServerSide } from "@/proxy/projects/project-functions";
import ProjectsSection from "../organisms/projects/ProjectsSection";

interface ProjectsSectionLoaderProps {
  mode: 'basic' | 'archive';
}
async function ProjectsSectionLoader({ mode }: ProjectsSectionLoaderProps) {
  const isBasicMode = mode === 'basic';
  const fetchFunction = isBasicMode ? getProjectsServerSide : getArchivedProjectsServerSide;
  const projectsResponse = await fetchFunction();
  const projectsData = await projectsResponse.json();
  return <ProjectsSection projects={projectsData} mode={mode} />;
}

export default ProjectsSectionLoader;