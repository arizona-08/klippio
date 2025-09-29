import { $Enums } from "@prisma/client";

export interface User{
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: $Enums.Role;
  forgotPasswordTokenSelector?: string | null;
  forgotPasswordToken?: string | null;
  forgotPasswordTokenExpiry?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserFilter = 'id' | 'email' | 'firstname' | 'lastname' | 'role' | 'forgotPasswordTokenSelector';

export interface UserQuery{
  filter: UserFilter;
  value: string | number;
}

export interface ForgotPasswordTokens{
  userId: number;
  forgotPasswordTokenSelector: string | null | undefined;
  forgotPasswordToken: string | null | undefined;
  forgotPasswordTokenExpiry: Date | null | undefined;
}