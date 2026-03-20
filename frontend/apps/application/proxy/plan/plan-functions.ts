import { getApi } from "../api";

export async function uploadPlan(formData: FormData, projectId: string) {
  const response = await getApi(`/api/images/upload-plan/${projectId}`, {
    method: "POST",
    body: formData,
  });

  return response;
}