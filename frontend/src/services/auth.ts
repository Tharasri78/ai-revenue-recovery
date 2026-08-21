import {
  clearDemoAuthSession,
  getAuthToken,
  setAuthToken,
  setDemoAuthSession,
  type DemoAuthSession,
} from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import type { AuthSession, LoginCredentials, OnboardingPayload, SignupPayload } from "@/types/auth";

interface BackendUser { id: string; email: string; role: string; merchantId: string }
interface BackendMerchant { id: string; businessName: string; businessEmail: string }
function toSession(user: BackendUser, merchant: BackendMerchant): DemoAuthSession {
  return { userId: user.id, email: user.email, role: user.role as AuthSession["role"], merchantId: merchant.id, merchantName: merchant.businessName, isAuthenticated: true, onboardingComplete: true, createdAt: new Date().toISOString() };
}

export async function authLogin(credentials: LoginCredentials): Promise<AuthSession> {
  const response = await apiRequest<{ accessToken: string; user: BackendUser; merchant: BackendMerchant }>("/auth/login", { method: "POST", body: JSON.stringify({ email: credentials.email.trim(), password: credentials.password }) });
  const session = toSession(response.user, response.merchant);
  setAuthToken(response.accessToken, credentials.rememberMe ?? true);
  setDemoAuthSession(session, credentials.rememberMe ?? true);
  return session;
}

export async function authRegister(payload: SignupPayload): Promise<AuthSession> {
  if (payload.password !== payload.confirmPassword) throw new Error("Passwords do not match.");
  await apiRequest("/auth/signup", { method: "POST", body: JSON.stringify({ businessName: payload.businessName.trim(), businessEmail: payload.businessEmail.trim(), name: payload.businessName.trim(), email: payload.businessEmail.trim(), password: payload.password }) });
  return authLogin({ email: payload.businessEmail, password: payload.password, rememberMe: true });
}

export async function authLogout(): Promise<void> {
  clearDemoAuthSession();
}

export async function authGetCurrentUser(): Promise<AuthSession | null> {
  if (!getAuthToken()) return null;

  try {
    const response = await apiRequest<{ user: BackendUser; merchant: BackendMerchant }>("/auth/me");
    const session = toSession(response.user, response.merchant);
    setDemoAuthSession(session, true);
    return session;
  } catch { return null; }
}

export async function authVerifyEmail(email: string): Promise<{ verified: boolean; email: string }> {
  const normalized = email.trim();

  return {
    verified: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized),
    email: normalized,
  };
}

export async function merchantCompleteOnboarding(payload: OnboardingPayload): Promise<AuthSession> {
  const current = await authGetCurrentUser();

  if (!current || !["MERCHANT_ADMIN", "MERCHANT_OPERATOR"].includes(current.role)) {
    throw new Error("Merchant authentication is required to complete onboarding.");
  }

  const updated: DemoAuthSession = {
    ...current,
    onboardingComplete: true,
    merchantName: payload.businessName || current.merchantName || "Northwind Studio",
  };

  // No onboarding persistence endpoint exists yet. Keep this completion flag local
  // until the backend exposes a merchant onboarding/profile update API.
  setDemoAuthSession(updated, true);
  return updated;
}

export async function merchantGetProfile() {
  const current = await authGetCurrentUser();

  return current && ["MERCHANT_ADMIN", "MERCHANT_OPERATOR"].includes(current.role)
    ? {
        merchantId: current.merchantId,
        businessName: current.merchantName ?? "Northwind Studio",
        businessEmail: current.email,
        status: "Test Mode",
      }
    : null;
}

export async function merchantUpdateProfile() {
  return { ok: true };
}
