import type { AuthSession, Permission, Role } from "@/types/auth";

export const AUTH_STORAGE_KEY = "ai-revenue-recovery-demo-auth";
export const AUTH_TOKEN_KEY = "ai-revenue-recovery-access-token";

export type DemoAuthSession = AuthSession & {
  isAuthenticated: boolean;
  createdAt: string;
};

export function getDemoAuthSession(): DemoAuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY) ?? window.sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<DemoAuthSession>;

    if (!parsed || parsed.isAuthenticated !== true || !parsed.role || !parsed.email) {
      return null;
    }

    return {
      userId: typeof parsed.userId === "string" ? parsed.userId : `${parsed.role.toLowerCase()}_demo`,
      email: parsed.email,
      role: parsed.role as Role,
      merchantId: typeof parsed.merchantId === "string" ? parsed.merchantId : null,
      merchantName: typeof parsed.merchantName === "string" ? parsed.merchantName : null,
      isAuthenticated: true,
      onboardingComplete: parsed.onboardingComplete === true,
      createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function setDemoAuthSession(session: DemoAuthSession, rememberMe = true) {
  if (typeof window === "undefined") {
    return;
  }

  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;
  otherStorage.removeItem(AUTH_STORAGE_KEY);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function setAuthToken(token: string, rememberMe = true) {
  if (typeof window === "undefined") return;
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage;
  otherStorage.removeItem(AUTH_TOKEN_KEY);
  storage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY) ?? window.sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function clearDemoAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export function hasRole(session: AuthSession | null, role: Role) {
  return Boolean(session?.isAuthenticated && session.role === role);
}

export function hasPermission(session: AuthSession | null, permission: Permission) {
  if (!session?.isAuthenticated) {
    return false;
  }

  const merchantPermissions: Permission[] = [
    "view_dashboard",
    "view_revenue_at_risk",
    "view_recovery",
    "view_transactions",
    "view_analytics",
    "view_policies",
    "view_audit_logs",
    "manage_settings",
  ];

  if (session.role === "ADMIN") {
    return merchantPermissions.includes(permission) || permission === "manage_settings";
  }

  if (session.role === "MERCHANT") {
    return merchantPermissions.includes(permission);
  }

  return false;
}

export function isProtectedMerchantPath(pathname: string) {
  const protectedPaths = [
    "/dashboard",
    "/revenue-at-risk",
    "/recovery",
    "/transactions",
    "/analytics",
    "/experiments",
    "/policies",
    "/audit-logs",
    "/settings",
  ];

  return protectedPaths.includes(pathname) || pathname.startsWith("/transactions/");
}

export function getDemoAuthState() {
  return getDemoAuthSession();
}

export function setDemoAuthState(email: string) {
  const session: DemoAuthSession = {
    userId: `merchant_${Math.random().toString(36).slice(2, 8)}`,
    email,
    role: "MERCHANT",
    merchantId: `merchant_${Math.random().toString(36).slice(2, 8)}`,
    merchantName: "Northwind Studio",
    isAuthenticated: true,
    onboardingComplete: true,
    createdAt: new Date().toISOString(),
  };

  setDemoAuthSession(session, true);
}
