import { api } from "./client";
import type { CreateProductInput, Product, UpdateProductInput } from "@/lib/types";

export const productsApi = {
  list: (params?: { search?: string; isActive?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.isActive !== undefined) query.set("isActive", String(params.isActive));
    const qs = query.toString();
    return api.get<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },
  get: (id: string) => api.get<Product>(`/api/products/${id}`),
  create: (input: CreateProductInput) => api.post<Product>("/api/products", input),
  update: (id: string, input: UpdateProductInput) => api.put<Product>(`/api/products/${id}`, input),
  setActive: (id: string, isActive: boolean) =>
    api.put<Product>(`/api/products/${id}/active`, { isActive }),
};
