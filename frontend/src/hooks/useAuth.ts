"use client";

import { useCallback, useEffect, useState } from "react";
import { clearDemoAuthSession, getDemoAuthSession, hasPermission, hasRole, isProtectedMerchantPath } from "@/lib/auth";
import type { AuthSession, Permission, Role } from "@/types/auth";

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refreshSession = useCallback(() => {
    setSession(getDemoAuthSession());
    setIsReady(true);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (sessionData: AuthSession) => {
    setSession(sessionData);
    setIsReady(true);
  }, []);

  const logout = useCallback(() => {
    clearDemoAuthSession();
    setSession(null);
    setIsReady(true);
  }, []);

  return {
    session,
    isReady,
    isAuthenticated: Boolean(session?.isAuthenticated),
    hasRole: (role: Role) => hasRole(session, role),
    hasPermission: (permission: Permission) => hasPermission(session, permission),
    isProtectedPath: (pathname: string) => isProtectedMerchantPath(pathname),
    login,
    logout,
    refreshSession,
  };
}
