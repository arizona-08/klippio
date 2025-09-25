import { $Enums } from "generated/prisma";

export interface CreateUserDTO{
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: $Enums.Role
}