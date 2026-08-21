import { clearDemoAuthSession, getAuthToken } from "@/lib/auth";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

function messageForStatus(status: number) {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 409) return "This operation conflicts with existing data.";
  if (status >= 500) return "The service is temporarily unavailable. Please try again.";
  return "Unable to complete the request.";
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers, cache: "no-store" });
  } catch {
    throw new ApiError(0, "Unable to reach the service. Check that the backend is running.");
  }

  let body: { message?: string } | null = null;
  try { body = await response.json(); } catch { body = null; }
  if (!response.ok) {
    if (response.status === 401) clearDemoAuthSession();
    throw new ApiError(response.status, body?.message || messageForStatus(response.status));
  }
  return body as T;
}