import { apiRequest } from "@/lib/api";
import type { ApiTransaction, PaginatedResponse } from "@/types/backend";

export interface TransactionQuery {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: string;
}

function queryString(query: TransactionQuery) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const result = params.toString();

  return result ? `?${result}` : "";
}

export async function getTransactions(
  query: TransactionQuery = {},
) {
  return apiRequest<PaginatedResponse<ApiTransaction>>(
    `/transactions${queryString(query)}`,
  );
}

export async function getTransactionById(id: string) {
  return apiRequest<ApiTransaction>(
    `/transactions/${encodeURIComponent(id)}`,
  );
}

export async function createTransaction(
  payload: Record<string, unknown>,
) {
  return apiRequest<ApiTransaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTransaction(
  id: string,
  payload: Record<string, unknown>,
) {
  return apiRequest<ApiTransaction>(
    `/transactions/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}