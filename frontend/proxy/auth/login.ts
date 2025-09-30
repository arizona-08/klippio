import { getApi } from "../api";
import { LoginDTO } from "./dto/login.dto";

export async function login(loginDto: LoginDTO){
  const response = await getApi('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginDto),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response;
}