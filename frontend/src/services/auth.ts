import {
  clearDemoAuthSession,
  getDemoAuthSession,
  setDemoAuthSession,
  type DemoAuthSession,
} from "@/lib/auth";
import type { AuthSession, LoginCredentials, OnboardingPayload, SignupPayload } from "@/types/auth";

function generateUserId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildSessionFromEmail(email: string, role: AuthSession["role"]): DemoAuthSession {
  const normalizedEmail = email.trim();

  return {
    userId: generateUserId(role.toLowerCase()),
    email: normalizedEmail,
    role,
    merchantId: role === "MERCHANT" ? `merchant_${Math.random().toString(36).slice(2, 8)}` : null,
    merchantName: role === "MERCHANT" ? "Northwind Studio" : null,
    isAuthenticated: true,
    onboardingComplete: role === "MERCHANT",
    createdAt: new Date().toISOString(),
  };
}

export async function authLogin(credentials: LoginCredentials): Promise<AuthSession> {
  const email = credentials.email.trim();
  const password = credentials.password.trim();

  if (!validateEmail(email)) {
    throw new Error("Enter a valid merchant email address.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const session = buildSessionFromEmail(email, "MERCHANT");
  setDemoAuthSession(session, credentials.rememberMe ?? true);
  return session;
}

export async function authRegister(payload: SignupPayload): Promise<AuthSession> {
  const businessName = payload.businessName.trim();
  const businessEmail = payload.businessEmail.trim();

  if (!businessName) {
    throw new Error("Business name is required.");
  }

  if (!validateEmail(businessEmail)) {
    throw new Error("Enter a valid business email address.");
  }

  if (payload.password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  if (payload.password !== payload.confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const session = {
    ...buildSessionFromEmail(businessEmail, "MERCHANT"),
    merchantName: businessName,
  };

  setDemoAuthSession(session, true);
  return session;
}

export async function authLogout(): Promise<void> {
  clearDemoAuthSession();
}

export async function authGetCurrentUser(): Promise<AuthSession | null> {
  return getDemoAuthSession();
}

export async function authVerifyEmail(email: string): Promise<{ verified: boolean; email: string }> {
  const normalized = email.trim();

  return {
    verified: validateEmail(normalized),
    email: normalized,
  };
}

export async function merchantCompleteOnboarding(payload: OnboardingPayload): Promise<AuthSession> {
  const current = getDemoAuthSession();

  if (!current || current.role !== "MERCHANT") {
    throw new Error("Merchant authentication is required to complete onboarding.");
  }

  const updated: DemoAuthSession = {
    ...current,
    onboardingComplete: true,
    merchantName: payload.businessName || current.merchantName || "Northwind Studio",
  };

  setDemoAuthSession(updated, true);
  return updated;
}

export async function merchantGetProfile() {
  const current = getDemoAuthSession();

  return current && current.role === "MERCHANT"
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
