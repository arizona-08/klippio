import { createContext } from "react";

export type User = {
  id?: number;
  firstname: string
  lastname: string
  email: string;
  password: string;
  profilePicture?: {
    url: string;
    zoom: number;
    offsetX: number;
    offsetY: number;
  },
  bannerPicture?: {
    url: string;
    zoom: number;
    offsetX: number;
    offsetY: number;
  },
  role: "STANDARD" | "PREMIUM" | "ADMIN"  
}

export type AuthUserType = {
  user: User | undefined
  setUser: (user: User | undefined) => void
}

export const AuthUserContext = createContext<AuthUserType | undefined>(undefined)