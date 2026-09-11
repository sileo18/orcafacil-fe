// Tipos espelhando os DTOs do backend (Services/Dtos). Mantidos em um
// único lugar para evitar duplicação (PROMPT-APP.md #61).

export type QuoteStatus = "Draft" | "Sent";
export type DiscountType = "Percentage" | "FixedAmount";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  businessId: string;
  businessName: string;
}

export interface Business {
  id: string;
  name: string;
  legalName: string | null;
  document: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  hasLogo: boolean;
  primaryColor: string | null;
  secondaryColor: string | null;
  footerText: string | null;
  defaultValidityDays: number;
  pixKey: string | null;
  updatedAt: string;
}

export interface UpdateBusinessInput {
  name: string;
  legalName: string | null;
  document: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  footerText: string | null;
  defaultValidityDays: number;
  pixKey: string | null;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  document: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerListItem {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  quotesCount: number;
}

export interface CustomerDetail {
  customer: Customer;
  recentQuotes: QuoteListItem[];
}

export interface CreateCustomerInput {
  name: string;
  phone: string | null;
  email: string | null;
  document: string | null;
  address: string | null;
  notes: string | null;
}

export type UpdateCustomerInput = CreateCustomerInput;

export interface Product {
  id: string;
  name: string;
  description: string | null;
  unitPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description: string | null;
  unitPrice: number;
}

export type UpdateProductInput = CreateProductInput;

export interface QuoteItemInput {
  productId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateQuoteInput {
  customerId: string;
  notes: string | null;
  validityDays: number | null;
  discountType: DiscountType;
  discountInput: number;
  additionalFees: number;
  items: QuoteItemInput[];
}

export interface QuoteItem {
  id: string;
  productId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface QuoteListItem {
  id: string;
  customerId: string;
  customerName: string;
  total: number;
  status: QuoteStatus;
  createdAt: string;
}

export interface QuoteDetail {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  notes: string | null;
  validityDays: number;
  subtotal: number;
  discountType: DiscountType;
  discountInput: number;
  discountAmount: number;
  additionalFees: number;
  total: number;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  items: QuoteItem[];
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface DashboardSummary {
  totalQuotes: number;
  draftCount: number;
  sentCount: number;
  recent: QuoteListItem[];
}

export interface QuoteListQuery {
  search?: string;
  status?: QuoteStatus;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}
