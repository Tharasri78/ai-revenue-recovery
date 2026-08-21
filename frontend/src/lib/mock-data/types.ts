export type TransactionStatus =
  | "Successful"
  | "Failed"
  | "Abandoned"
  | "Recovery attempted"
  | "Recovered";

export type RecoveryPolicyStatus = "Approved" | "Pending" | "Blocked" | "Executed";

export interface Merchant {
  id: string;
  name: string;
  storeName: string;
  email: string;
  status: "Test Mode" | "Live";
  region: string;
  accountTier: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  lifetimeValue: number;
  paymentHistory: string[];
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: "INR";
  paymentMethod: "UPI" | "Card" | "Net Banking" | "Wallet" | "EMI";
  status: TransactionStatus;
  failureReason: string;
  recoveryStatus:
    | "None"
    | "Recommended"
    | "Approved"
    | "Pending"
    | "Recovered"
    | "Awaiting approval";
  createdAt: string;
  updatedAt: string;
  riskLevel: "Low" | "Medium" | "High";
  recoveryProbability: number;
  recommendedAction: string;
  policyResult: "Approved" | "Needs review" | "Blocked";
  expectedRecoveryValue: number;
  isRecoverable: boolean;
}

export interface RecoveryCase {
  id: string;
  transactionId: string;
  customerName: string;
  amount: number;
  recoveryProbability: number;
  recommendedAction: string;
  reason: string;
  expectedRecoveryValue: number;
  policyResult: "Approved" | "Needs review" | "Blocked";
  status: "Recommended" | "Awaiting approval" | "Completed";
  lastUpdated: string;
}

export interface RecoveryDecision {
  id: string;
  transactionId: string;
  recoveryProbability: number;
  recommendedAction: string;
  reason: string;
  reasoningSignals: string[];
  riskFactors: string[];
  policyChecks: Array<{
    label: string;
    value: string;
    result: "Pass" | "Review" | "Fail";
  }>;
  expectedRecoveryValue: number;
  status: RecoveryPolicyStatus;
}

export interface RecoveryAttempt {
  timestamp: string;
  action: string;
  result: "Success" | "Pending" | "Failed";
  attemptCount: number;
  amount: number;
}

export interface Policy {
  id: string;
  maximumRetryAttempts: number;
  maximumCustomerMessages: number;
  maximumDiscount: number;
  recoveryWindowHours: number;
  maximumAutoRecoveryAmount: number;
  requireApprovalAbove: number;
  mode: "Manual" | "Assisted" | "Autonomous";
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  transactionId: string;
  event: string;
  actor: string;
  aiDecision: string;
  policyResult: "Approved" | "Pending" | "Blocked";
  action: string;
  outcome: "Success" | "Pending" | "Failed" | "Blocked";
}

export interface InsightMetric {
  label: string;
  value: string;
  delta: string;
  description: string;
}

export interface AnalyticsPoint {
  label: string;
  revenueAtRisk: number;
  recovered: number;
}

export interface FunnelPoint {
  label: string;
  value: number;
}

export interface AnalyticsData {
  kpis: InsightMetric[];
  revenueTrend: AnalyticsPoint[];
  funnel: FunnelPoint[];
  recoveryReasons: Array<{ name: string; value: number; }>; 
  recoveryStrategies: Array<{ strategy: string; value: number; }>; 
  outcomes: Array<{ name: string; value: number; }>; 
  failureReasons: Array<{ name: string; value: number; }>; 
  paymentMethods: Array<{ name: string; value: number; }>; 
  experiments: {
    transactionsTested: number;
    baselineRecovered: number;
    aiRecovered: number;
    improvement: number;
    restorationRate: number;
    unnecessaryIntervention: number;
    averageRecoveryCost: number;
  };
}
