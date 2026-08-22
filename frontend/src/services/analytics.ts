import { apiRequest } from "@/lib/api";
import { analyticsData } from "@/lib/mock-data/mock-data";

export async function getAnalyticsData() {
  return analyticsData;
}

export async function getDashboardData() {
  return apiRequest<any>("/analytics/dashboard");
}

