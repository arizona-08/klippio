import { fetchFromClient } from "../api";

export async function uploadPlan(formData: FormData, projectId: string) {
  const response = await fetchFromClient(`/api/plans/upload-plan/${projectId}`, {
    method: "POST",
    body: formData,
  });

  return response;
}

export async function fetchPlan(projectId: string) {
  const response = await fetchFromClient(`/api/plans/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function getPlanById(projectId: string, planId: string) {
  const response = await fetchFromClient(`/api/plans/${projectId}/${planId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function getLastOpenedPlan(projectId: string) {
  const response = await fetchFromClient(`/api/plans/last-opened/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export function renamePlan(planId: string, newName: string, projectId: string) {
  return fetchFromClient(`/api/plans/${projectId}/${planId}/rename`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newName }),
  });
}

export async function deletePlan(planId: string) {
  const response = await fetchFromClient(`/api/plans/${planId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}



