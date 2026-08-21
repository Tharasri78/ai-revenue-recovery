export type BackendTransactionStatus = "SUCCESSFUL" | "FAILED" | "ABANDONED" | "RECOVERY_ATTEMPTED" | "RECOVERED";
export type BackendPaymentMethod = "UPI" | "CARD" | "NET_BANKING" | "WALLET" | "EMI" | "OTHER";
export type BackendRecoveryStatus = "NONE" | "PENDING" | "RECOMMENDED" | "AWAITING_APPROVAL" | "APPROVED" | "IN_PROGRESS" | "RECOVERED" | "FAILED" | "REJECTED" | "EXPIRED";
export type BackendRecoveryAction = "RETRY_PAYMENT" | "SEND_RECOVERY_LINK" | "OFFER_ALTERNATIVE_PAYMENT" | "CUSTOMER_NOTIFICATION" | "APPLY_DISCOUNT" | "MANUAL_REVIEW" | "OTHER";
export type BackendRecoveryOutcome = "PENDING" | "SUCCESS" | "FAILED" | "BLOCKED" | "REJECTED" | "EXPIRED";

export interface ApiTransaction {
  id: string;
  merchantId: string;
  externalReference: string | null;
  customerReference: string | null;
  customerName: string | null;
  customerEmail: string | null;
  amount: number | string;
  currency: string;
  paymentStatus: BackendTransactionStatus;
  paymentMethod: BackendPaymentMethod;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
  recoveryCase?: ApiRecoveryCase | null;
}

export interface ApiRecoveryAttempt {
  id: string;
  recoveryCaseId: string;
  action: BackendRecoveryAction;
  attemptNumber: number;
  amount: number | string | null;
  outcome: BackendRecoveryOutcome;
  failureReason: string | null;
  attemptedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiRecoveryCase {
  id: string;
  merchantId: string;
  transactionId: string;
  status: BackendRecoveryStatus;
  recoveryScore: number | string | null;
  confidence: number | string | null;
  recoverableAmount: number | string | null;
  selectedAction: BackendRecoveryAction | null;
  outcome: BackendRecoveryOutcome;
  recommendationReason: string | null;
  createdAt: string;
  updatedAt: string;
  transaction?: ApiTransaction;
  attempts?: ApiRecoveryAttempt[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pagination: { page: number; limit: number; totalPages: number };
}

export function numericValue(value: number | string | null | undefined) {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}