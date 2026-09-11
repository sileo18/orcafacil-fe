import { api, apiUrl } from "./client";
import type { Business } from "@/lib/types";

export const filesApi = {
  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.postForm<Business>("/api/files/logo", formData);
  },
  logoUrl: (updatedAt?: string) => apiUrl(`/api/files/logo${updatedAt ? `?v=${encodeURIComponent(updatedAt)}` : ""}`),
};
