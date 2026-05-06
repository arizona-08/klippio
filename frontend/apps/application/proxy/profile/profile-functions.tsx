import { fetchFromClient } from "../api";

export async function modifyPersonalInfo(credentials: {
  firstname: string;
  lastname: string;
  email: string;
}) {
  const response = await fetchFromClient("/api/profile/edit-personal-info", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return response;
}


export async function modifyPasswordInfo(credentials: {
  currentPassword: string;
  newPassword: string;
}) {
  const response = await fetchFromClient("/api/profile/edit-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return response;
}

export async function modifyProfilePicture(formData: FormData) {
  const response = await fetchFromClient("/api/profile/edit-profile-picture", {
    method: "PUT",
    body: formData,
  });

  return response;
}