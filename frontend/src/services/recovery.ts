import { recoveryCases, recoveryDecisionDetails } from "@/lib/mock-data/mock-data";

export async function getRecoveryCases() {
  return recoveryCases;
}

export async function getRecoveryDecisionByTransactionId(transactionId: string) {
  return recoveryDecisionDetails.find((decision) => decision.transactionId === transactionId) ?? null;
}
