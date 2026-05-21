import { fetchFromClient } from "../api";

export async function addMarker(formData: FormData, projectId: string, planId: string) {
  const response = await fetchFromClient(`/api/markers/${projectId}/${planId}/marker`, {
    method: "POST",
    body: formData,
  });

  return response;
}

export async function getMarkers(planId: string) {
  const response = await fetchFromClient(`/api/markers/${planId}/markers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function deleteMarker(markerId: string) {
  const response = await fetchFromClient(`/api/markers/${markerId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function editMarker(projectId: string, planId: string, markerId: string, formData: FormData) {
  const response = await fetchFromClient(`/api/markers/${projectId}/${planId}/${markerId}`, {
    method: "PUT",
    body: formData,
  });

  return response;
}