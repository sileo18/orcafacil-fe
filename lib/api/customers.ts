import { api } from "./client";
import type {
  Customer,
  CustomerDetail,
  CustomerListItem,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/lib/types";

export const customersApi = {
  list: (search?: string) =>
    api.get<CustomerListItem[]>(`/api/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  get: (id: string) => api.get<CustomerDetail>(`/api/customers/${id}`),
  create: (input: CreateCustomerInput) => api.post<Customer>("/api/customers", input),
  update: (id: string, input: UpdateCustomerInput) => api.put<Customer>(`/api/customers/${id}`, input),
};
