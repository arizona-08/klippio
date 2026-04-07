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

export async function modifyProject(data: CreateProjectDTO){
  const response = await fetchFromClient("/api/projects/modify", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response;
}

export async function getProjects(){
  const response = await fetchFromClient("/api/projects/all", {
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