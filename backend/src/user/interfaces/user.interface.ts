import { $Enums } from "@prisma/client";

export interface User{
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: $Enums.Role
}

export type UserFilter = 'id' | 'email' | 'firstname' | 'lastname' | 'role';

export interface UserQuery{
  filter: UserFilter;
  value: string | number;
}