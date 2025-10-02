import { getApi } from "../api";

export async function getAuthUser(){
  const response = await getApi('/api/auth/me', {
    method: "GET"
  });

  return response;
}