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

export async function editUserPicture(formData: FormData) {
  const response = await fetchFromClient("/api/profile/edit-user-picture", {
    method: "PATCH",
    body: formData,
  });

  return response;
}

export async function deleteAccount() {
  return fetchFromClient('/api/profile/account', {
    method: 'DELETE',
  });
}
