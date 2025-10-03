export interface RegisterDTO{
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmation: string;
  role: "ADMIN" | "STANDARD" | "PREMIUM"
}