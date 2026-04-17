import { fetchFromClient } from "../api";

export async function getProjectRootFolder(projectId: string){
  const response = await fetchFromClient(`/api/projects/${projectId}/folders/root-folder`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function getFolder(folderId: string){
  const response = await fetchFromClient(`/api/folders/${folderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function createFolder(name: string, projectId: string, parentFolderId: string | null){
  const response = await fetchFromClient(`/api/projects/${projectId}/folders/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      projectId,
      parentFolderId,
    }),
  });

  return response;
}

export async function renameFolder(folderId: string, newName: string, projectId: string){
  const response = await fetchFromClient(`/api/projects/${projectId}/folders/${folderId}/rename`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newName,
    }),
  });

  return response;
}

export async function deleteFolder(folderId: string, projectId: string){
  const response = await fetchFromClient(`/api/projects/${projectId}/folders/${folderId}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}