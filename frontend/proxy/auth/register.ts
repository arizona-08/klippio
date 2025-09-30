import { getApi } from "../api";
import { RegisterDTO } from "./dto/register.dto";

export async function register(registerDto: RegisterDTO){
  const response = await getApi('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(registerDto),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response
}