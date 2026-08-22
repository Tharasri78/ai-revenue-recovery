import { apiRequest } from "@/lib/api";

export async function getDashboardData() {
  return apiRequest<any>("/analytics/dashboard");
}
