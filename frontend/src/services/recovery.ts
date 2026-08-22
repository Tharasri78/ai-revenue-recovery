import { apiRequest } from "@/lib/api";
import type {
  ApiRecoveryAttempt,
  ApiRecoveryCase,
  BackendRecoveryAction,
  BackendRecoveryOutcome,
  BackendRecoveryStatus,
  PaginatedResponse,
} from "@/types/backend";

export interface CreateRecoveryCasePayload {
  transactionId: string;
}

export interface UpdateRecoveryCasePayload {
  status?: BackendRecoveryStatus;
  recoveryScore?: number;
  confidence?: number;
  recoverableAmount?: number;
  selectedAction?: BackendRecoveryAction;
  recommendationReason?: string;
  outcome?: BackendRecoveryOutcome;
}

export interface CreateRecoveryAttemptPayload {
  action: BackendRecoveryAction;
  attemptNumber?: number;
  amount?: number;
  outcome?: BackendRecoveryOutcome;
  failureReason?: string;
}

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

export async function createRecoveryCase(payload: CreateRecoveryCasePayload) {
  return apiRequest<ApiRecoveryCase>("/recovery", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateRecoveryCase(id: string, payload: UpdateRecoveryCasePayload) {
  return apiRequest<ApiRecoveryCase>(`/recovery/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function createRecoveryAttempt(id: string, payload: CreateRecoveryAttemptPayload) {
  return apiRequest<ApiRecoveryAttempt>(`/recovery/${encodeURIComponent(id)}/attempts`, { method: "POST", body: JSON.stringify(payload) });
}

export async function getRecoveryDecisionByTransactionId(transactionId: string) {
  const response = await getRecoveryCases();
  return response.items.find((item) => item.transactionId === transactionId) ?? null;
}
