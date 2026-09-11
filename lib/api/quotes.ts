import { api, apiUrl } from "./client";
import type {
  CreateQuoteInput,
  DashboardSummary,
  PagedResult,
  QuoteDetail,
  QuoteListItem,
  QuoteListQuery,
} from "@/lib/types";

function buildQuery(query: QuoteListQuery = {}): string {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  params.set("page", String(query.page ?? 1));
  params.set("pageSize", String(query.pageSize ?? 20));
  return params.toString();
}

export const quotesApi = {
  list: (query?: QuoteListQuery) =>
    api.get<PagedResult<QuoteListItem>>(`/api/quotes?${buildQuery(query)}`),
  dashboard: () => api.get<DashboardSummary>("/api/quotes/dashboard"),
  get: (id: string) => api.get<QuoteDetail>(`/api/quotes/${id}`),
  create: (input: CreateQuoteInput) => api.post<QuoteDetail>("/api/quotes", input),
  update: (id: string, input: CreateQuoteInput) => api.put<QuoteDetail>(`/api/quotes/${id}`, input),
  duplicate: (id: string) => api.post<QuoteDetail>(`/api/quotes/${id}/duplicate`),
  markAsSent: (id: string) => api.post<QuoteDetail>(`/api/quotes/${id}/send`),
  downloadPdf: (id: string) => api.getBlob(`/api/quotes/${id}/pdf`),
  previewUrl: (id: string) => apiUrl(`/api/quotes/${id}/preview`),
};
