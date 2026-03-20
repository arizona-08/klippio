import { getApi } from "../api";
import { CreateProjectDTO } from "./dto/create-project.dto";

export async function createProject(data: CreateProjectDTO){
  const response = await getApi("/api/projects/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response;
}

export async function modifyProject(data: CreateProjectDTO){
  const response = await getApi("/api/projects/modify", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response;
}

export async function getProjects(){
  const response = await getApi("/api/projects/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  return response;
}