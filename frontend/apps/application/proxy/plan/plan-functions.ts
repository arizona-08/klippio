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

export async function getLastOpenedPlan(projectId: string) {
  const response = await fetchFromClient(`/api/plans/last-opened/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
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



//-----MARKERS-----

export async function addMarker(formData: FormData, projectId: string, planId: string) {
  const response = await fetchFromClient(`/api/plans/${projectId}/${planId}/marker`, {
    method: "POST",
    body: formData,
  });

  return response;
}

export async function getMarkers(planId: string) {
  const response = await fetchFromClient(`/api/plans/${planId}/markers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function deleteMarker(markerId: string) {
  const response = await fetchFromClient(`/api/plans/${markerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function editMarker(projectId: string, planId: string, markerId: string, formData: FormData) {
  const response = await fetchFromClient(`/api/plans/${projectId}/${planId}/${markerId}`, {
    method: "PUT",
    body: formData,
  });

  return response;
}