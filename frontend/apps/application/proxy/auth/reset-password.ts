import { getApi } from "../api";
import { ResetPasswordDTO } from "./dto/reset-password.dto";

export async function resetPassword(token: string, resetPasswordDTO: ResetPasswordDTO){
  const response = await getApi(`/api/auth/reset-password?token=${token}`, {
    method: 'PATCH',
    body: JSON.stringify(resetPasswordDTO),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response
}