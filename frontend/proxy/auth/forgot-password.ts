import { getApi } from "../api";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto";

export async function forgotPassword(forgotPasswordDto: ForgotPasswordDTO){
  const response = await getApi('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(forgotPasswordDto),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response
}