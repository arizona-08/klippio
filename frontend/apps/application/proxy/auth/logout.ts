import { getApi } from "../api";

export async function logout(){
  const response = await getApi('/api/auth/logout', {method: 'DELETE'});
  return response
}