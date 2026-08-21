export const AUTH_STORAGE_KEY = "ai-revenue-recovery-demo-auth";

export interface DemoAuthState {
  isAuthenticated: boolean;
  email: string | null;
}

export function getDemoAuthState(): DemoAuthState {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, email: null };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return { isAuthenticated: false, email: null };
    }

    const parsed = JSON.parse(raw) as Partial<DemoAuthState>;

    if (!parsed || parsed.isAuthenticated !== true) {
      return { isAuthenticated: false, email: null };
    }

    return {
      isAuthenticated: true,
      email: typeof parsed.email === "string" ? parsed.email : null,
    };
  } catch {
    return { isAuthenticated: false, email: null };
  }
}

export function setDemoAuthState(email: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ isAuthenticated: true, email }),
  );
}

export function clearDemoAuthState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isProtectedPath(pathname: string) {
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
