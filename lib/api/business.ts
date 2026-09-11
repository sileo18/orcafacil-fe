import { api } from "./client";
import type { Business, UpdateBusinessInput } from "@/lib/types";

export const businessApi = {
  get: () => api.get<Business>("/api/business"),
  update: (input: UpdateBusinessInput) => api.put<Business>("/api/business", input),
};
