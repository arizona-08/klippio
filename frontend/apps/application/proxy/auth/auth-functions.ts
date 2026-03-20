import { getApi } from "../api";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";

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

export async function logout(){
  const response = await getApi('/api/auth/logout', {method: 'DELETE'});
  return response
}

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

export async function getAuthUser(){
  const response = await getApi('/api/auth/me', {
    method: "GET"
  });

  return response;
}

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