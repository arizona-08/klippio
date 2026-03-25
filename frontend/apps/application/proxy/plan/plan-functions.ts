import { getApi } from "../api";

export async function uploadPlan(formData: FormData, projectId: string) {
  const response = await getApi(`/api/plans/upload-plan/${projectId}`, {
    method: "POST",
    body: formData,
  });

  return response;
}

export async function fetchPlan(projectId: string) {
  const response = await getApi(`/api/plans/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function getLastOpenedPlan(projectId: string) {
  const response = await getApi(`/api/plans/last-opened/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function deletePlan(planId: string) {
  const response = await getApi(`/api/plans/${planId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}



//-----MARKERS-----

export async function addMarker(formData: FormData, projectId: string, planId: string) {
  const response = await getApi(`/api/plans/${projectId}/${planId}/marker`, {
    method: "POST",
    body: formData,
  });

  return response;
}