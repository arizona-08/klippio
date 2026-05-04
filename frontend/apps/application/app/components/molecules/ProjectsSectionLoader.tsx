import { getProjectsServerSide } from "@/proxy/projects/project-functions";
import ProjectsSection from "../organisms/projects/ProjectsSection";

// Ce composant s'occupe de la partie "lente"
async function ProjectsSectionLoader() {
  const projectsResponse = await getProjectsServerSide();
  const projectsData = await projectsResponse.json();
  
  return <ProjectsSection projects={projectsData} />;
}

export default ProjectsSectionLoader;