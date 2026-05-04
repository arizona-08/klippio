import { fetchFromClient } from "../api";
import { fetchFromServer } from "../serverApi";
import { CreateProjectDTO } from "./dto/create-project.dto";

export async function createProject(data: CreateProjectDTO){
  const response = await fetchFromClient("/api/projects/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response;
}

export async function modifyProject(data: CreateProjectDTO, projectId: string){
  const response = await fetchFromClient(`/api/projects/${projectId}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response;
}

export async function getProjects(sortOptions?: { sortBy: string, order: 'asc' | 'desc' } ){
  const response = await fetchFromClient(`/api/projects/all${sortOptions ? `?sortBy=${sortOptions.sortBy}&order=${sortOptions.order}` : ''}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  return response;
}


// ----- SERVER SIDE FUNCTIONS ------

export async function getProjectsServerSide(){
  const response = await fetchFromServer("/api/projects/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  return response;
}