import { apiRequest } from "@/lib/api";

export interface ApiPolicy {
  id: string;
  merchantId: string;
  name: string;
  description: string | null;
  status: string;
  mode: string;
  configuration: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export async function getPolicy(): Promise<ApiPolicy | null> {
  return apiRequest<ApiPolicy | null>("/policies");
}

export async function updatePolicy(payload: Partial<ApiPolicy>): Promise<ApiPolicy> {
  return apiRequest<ApiPolicy>("/policies", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
