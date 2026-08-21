export type Role = "MERCHANT" | "ADMIN" | "CUSTOMER";

export interface Merchant {
  id: string;
  businessName: string;
  businessEmail: string;
  category: string;
  region: string;
  status: "Test Mode" | "Live";
}

export interface User {
  userId: string;
  email: string;
  role: Role;
  merchantId?: string | null;
  merchantName?: string | null;
}

export interface AuthSession extends User {
  isAuthenticated: boolean;
  onboardingComplete?: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  businessName: string;
  businessEmail: string;
  password: string;
  confirmPassword: string;
}

export interface OnboardingPayload {
  businessName: string;
  category: string;
  businessEmail: string;
  gatewayConnected: boolean;
  recoveryMode: "Assisted" | "Manual" | "Autonomous";
  maxRetryAttempts: number;
  recoveryWindowHours: number;
  maxAutoRecoveryAmount: number;
}

export type Permission =
  | "view_dashboard"
  | "view_revenue_at_risk"
  | "view_recovery"
  | "view_transactions"
  | "view_analytics"
  | "view_policies"
  | "view_audit_logs"
  | "manage_settings";
