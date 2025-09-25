import { $Enums } from "@prisma/client";

export interface CreateUserDTO{
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: $Enums.Role
}