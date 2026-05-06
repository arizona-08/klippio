import { fetchFromClient } from "../api";

export async function editPersonalInfo(credentials: {
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


export async function editPasswordInfo(credentials: {
  currentPassword: string;
  newPassword: string;
  confirmationPassword: string;
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

export async function editProfilePicture(formData: FormData) {
  const response = await fetchFromClient("/api/profile/edit-profile-picture", {
    method: "PUT",
    body: formData,
  });

  return response;
}