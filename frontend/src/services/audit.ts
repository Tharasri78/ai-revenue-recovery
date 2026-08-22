import { apiRequest } from "@/lib/api";
import type { PaginatedResponse } from "@/types/backend";

export interface ApiAuditLog {
  id: string;
  merchantId: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export async function getAuditEvents(query: { page?: number; limit?: number; entityType?: string } = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.entityType) params.set("entityType", query.entityType);

  const qStr = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<PaginatedResponse<ApiAuditLog>>(`/audit-logs${qStr}`);
}
