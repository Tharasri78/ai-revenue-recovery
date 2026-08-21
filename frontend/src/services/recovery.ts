import { apiRequest } from "@/lib/api";
import type { ApiRecoveryAttempt, ApiRecoveryCase, PaginatedResponse } from "@/types/backend";

export async function getRecoveryCases(query: { page?: number; limit?: number; status?: string } = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => { if (value) params.set(key, String(value)); });
  const suffix = params.toString() ? `?${params}` : "";
  return apiRequest<PaginatedResponse<ApiRecoveryCase>>(`/recovery${suffix}`);
}

export async function getRecoveryCase(id: string) {
  return apiRequest<ApiRecoveryCase>(`/recovery/${encodeURIComponent(id)}`);
}

export async function getRecoveryAttempts(id: string) {
  return apiRequest<ApiRecoveryAttempt[]>(`/recovery/${encodeURIComponent(id)}/attempts`);
}

export async function createRecoveryCase(transactionId: string, payload: Record<string, unknown> = {}) {
  return apiRequest<ApiRecoveryCase>("/recovery", { method: "POST", body: JSON.stringify({ ...payload, transactionId }) });
}

export async function updateRecoveryCase(id: string, payload: Record<string, unknown>) {
  return apiRequest<ApiRecoveryCase>(`/recovery/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function createRecoveryAttempt(id: string, payload: Record<string, unknown>) {
  return apiRequest<ApiRecoveryAttempt>(`/recovery/${encodeURIComponent(id)}/attempts`, { method: "POST", body: JSON.stringify(payload) });
}

export async function getRecoveryDecisionByTransactionId(transactionId: string) {
  const response = await getRecoveryCases();
  return response.items.find((item) => item.transactionId === transactionId) ?? null;
}
