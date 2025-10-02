import { createContext } from "react";

export type User = {
  firstname: string
  lastname: string
  email: string;
  password: string;
  role: "STANDARD" | "PREMIUM" | "ADMIN"  
}

export type AuthUserType = {
  user: User | undefined
  setUser: (user: User | undefined) => void
}

export const AuthUserContext = createContext<AuthUserType | undefined>(undefined)