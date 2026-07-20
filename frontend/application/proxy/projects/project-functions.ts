import { fetchFromClient } from "../api";
import { fetchFromServer } from "../serverApi";
import { CreateProjectDTO } from "./dto/create-project.dto";

export async function createProject(data: CreateProjectDTO) {
  const response = await fetchFromClient("/api/projects/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}

export async function getProjectById(projectId: string) {
  const response = await fetchFromClient(`/api/projects/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function archiveProject(projectId: string) {
  const response = await fetchFromClient(`/api/projects/${projectId}/archive`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function unarchiveProject(projectId: string) {
  const response = await fetchFromClient(
    `/api/projects/${projectId}/unarchive`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response;
}

export async function deleteProject(projectId: string) {
  const response = await fetchFromClient(`/api/projects/${projectId}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function modifyProject(data: CreateProjectDTO, projectId: string) {
  const response = await fetchFromClient(`/api/projects/${projectId}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}

export async function getProjects(sortOptions?: {
  sortBy: string;
  order: "asc" | "desc";
}) {
  const response = await fetchFromClient("/api/projects/all", {
    method: "GET",
    query: sortOptions,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function getArchivedProjects(sortOptions?: {
  sortBy: string;
  order: "asc" | "desc";
}) {
  const response = await fetchFromClient("/api/projects/archived", {
    method: "GET",
    query: sortOptions,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function updateProjectThumbnail(
  projectId: string,
  formData: FormData,
) {
  const response = await fetchFromClient(
    `/api/projects/${projectId}/thumbnail`,
    {
      method: "PATCH",
      body: formData,
    },
  );

  return response;
}

export async function inviteCollaboratorToProject(
  projectId: string,
  invitedEmail: string,
  invitedRole: "VIEWER" | "EDITOR",
){
  const response = await fetchFromClient(`/api/projects/${projectId}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({invitedEmail, invitedRole })
  });

  return response;
}

export async function removeCollaboratorFromProject(
  projectId: string,
  collaboratorId: number,
) {
  return fetchFromClient(
    `/api/projects/${projectId}/collaborators/${collaboratorId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export async function updateCollaboratorRole(
  projectId: string,
  collaboratorId: number,
  role: "VIEWER" | "EDITOR",
) {
  return fetchFromClient(
    `/api/projects/${projectId}/collaborators/${collaboratorId}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    },
  );
}

export async function getInvitationDetails(invitationToken: string) {
  const response = await fetchFromClient(
    `/api/projects/invitation/${invitationToken}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response;
}

export async function acceptProjectInvitation(invitationToken: string) {
  const response = await fetchFromClient(
    `/api/projects/invitation/${invitationToken}/accept`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response;
}

export async function denyProjectInvitation(invitationToken: string) {
  const response = await fetchFromClient(
    `/api/projects/invitation/${invitationToken}/deny`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response;
}

// ----- SERVER SIDE FUNCTIONS ------

export async function getProjectsServerSide() {
  const response = await fetchFromServer("/api/projects/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function getArchivedProjectsServerSide() {
  const response = await fetchFromServer("/api/projects/archived", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}
