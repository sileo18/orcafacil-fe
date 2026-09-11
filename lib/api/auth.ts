import { api } from "./client";
import type { AuthUser } from "@/lib/types";

export interface RegisterInput {
  email: string;
  password: string;
  businessName: string | null;
  displayName: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  register: (input: RegisterInput) => api.post<AuthUser>("/api/auth/register", input),
  login: (input: LoginInput) => api.post<AuthUser>("/api/auth/login", input),
  logout: () => api.post<void>("/api/auth/logout"),
  me: () => api.get<AuthUser>("/api/auth/me"),
};
