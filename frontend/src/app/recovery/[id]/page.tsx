"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  createRecoveryAttempt,
  getRecoveryAttempts,
  getRecoveryCase,
  updateRecoveryCase,
} from "@/services/recovery";
import type {
  ApiRecoveryAttempt,
  ApiRecoveryCase,
  BackendRecoveryAction,
  BackendRecoveryOutcome,
  BackendRecoveryStatus,
} from "@/types/backend";

const recoveryStatuses: BackendRecoveryStatus[] = [
  "PENDING",
  "RECOMMENDED",
  "AWAITING_APPROVAL",
  "APPROVED",
  "IN_PROGRESS",
  "RECOVERED",
  "FAILED",
  "REJECTED",
  "EXPIRED",
];

const recoveryActions: BackendRecoveryAction[] = [
  "RETRY_PAYMENT",
  "SEND_RECOVERY_LINK",
  "OFFER_ALTERNATIVE_PAYMENT",
  "CUSTOMER_NOTIFICATION",
  "APPLY_DISCOUNT",
  "MANUAL_REVIEW",
  "OTHER",
];

const recoveryOutcomes: BackendRecoveryOutcome[] = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "BLOCKED",
  "REJECTED",
  "EXPIRED",
];

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function RecoveryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [caseItem, setCaseItem] = useState<ApiRecoveryCase | null>(null);
  const [attempts, setAttempts] = useState<ApiRecoveryAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creatingAttempt, setCreatingAttempt] = useState(false);
  const [caseForm, setCaseForm] = useState<{
    status: BackendRecoveryStatus;
    outcome: BackendRecoveryOutcome;
    selectedAction: "" | BackendRecoveryAction;
  }>({ status: "PENDING", outcome: "PENDING", selectedAction: "" });
  const [attemptForm, setAttemptForm] = useState<{
    action: BackendRecoveryAction;
    attemptNumber: string;
    amount: string;
    outcome: BackendRecoveryOutcome;
    failureReason: string;
  }>({
    action: "SEND_RECOVERY_LINK",
    attemptNumber: "",
    amount: "",
    outcome: "PENDING",
    failureReason: "",
  });

  async function loadCase() {
    setLoading(true);
    setError("");
    setNotFound(false);
    try {
      const [caseResponse, attemptsResponse] = await Promise.all([
        getRecoveryCase(id),
        getRecoveryAttempts(id),
      ]);
      setCaseItem(caseResponse);
      setAttempts(attemptsResponse);
      setCaseForm({
        status: caseResponse.status,
        outcome: caseResponse.outcome,
        selectedAction: caseResponse.selectedAction ?? "",
      });
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        router.replace("/login");
        return;
      }
      if (cause instanceof ApiError && cause.status === 404) setNotFound(true);
      setError(cause instanceof Error ? cause.message : "Unable to load recovery case.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCase();
  }, [id, router]);

  async function handleCaseUpdate(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      setSaving(true);
      const updated = await updateRecoveryCase(id, {
        status: caseForm.status,
        outcome: caseForm.outcome,
        selectedAction: caseForm.selectedAction || undefined,
      });
      setCaseItem(updated);
      setAttempts(updated.attempts ?? attempts);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        router.replace("/login");
        return;
      }
      setError(cause instanceof Error ? cause.message : "Unable to update recovery case.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAttemptCreate(event: FormEvent) {
    event.preventDefault();
    setError("");
    const amount = attemptForm.amount.trim() ? Number(attemptForm.amount) : undefined;
    const attemptNumber = attemptForm.attemptNumber.trim() ? Number(attemptForm.attemptNumber) : undefined;

    if (amount !== undefined && (!Number.isFinite(amount) || amount <= 0)) {
      setError("Attempt amount must be greater than 0.");
      return;
    }

    if (attemptNumber !== undefined && (!Number.isInteger(attemptNumber) || attemptNumber <= 0)) {
      setError("Attempt number must be a positive whole number.");
      return;
    }

    try {
      setCreatingAttempt(true);
      await createRecoveryAttempt(id, {
        action: attemptForm.action,
        attemptNumber,
        amount,
        outcome: attemptForm.outcome,
        failureReason: attemptForm.failureReason.trim() || undefined,
      });
      setAttemptForm({
        action: "SEND_RECOVERY_LINK",
        attemptNumber: "",
        amount: "",
        outcome: "PENDING",
        failureReason: "",
      });
      const attemptsResponse = await getRecoveryAttempts(id);
      setAttempts(attemptsResponse);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        router.replace("/login");
        return;
      }
      setError(cause instanceof Error ? cause.message : "Unable to create recovery attempt.");
    } finally {
      setCreatingAttempt(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Recovery case</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#F5F0E6]">{caseItem?.transaction?.externalReference ?? caseItem?.transactionId ?? id}</h2>
          </div>
          {caseItem ? <StatusBadge status={caseItem.status} /> : null}
        </div>

        {error ? <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-3 py-2 text-sm text-[#F7B0A5]">{error}</div> : null}
        {loading ? <Card className="p-5 text-sm text-[#B7AEA2]">Loading recovery case...</Card> : null}
        {notFound ? <Card className="p-5 text-sm text-[#B7AEA2]">Recovery case not found.</Card> : null}

        {caseItem ? (
          <div className="grid min-w-0 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              <Card title="Payment information" className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Transaction</p><p className="mt-1 text-[#F5F0E6]">{caseItem.transaction?.externalReference ?? caseItem.transactionId}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Amount</p><p className="mt-1 text-[#F5F0E6]">{formatCurrency(Number(caseItem.transaction?.amount ?? 0))}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Payment method</p><p className="mt-1 text-[#F5F0E6]">{caseItem.transaction?.paymentMethod?.replaceAll("_", " ") ?? "-"}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Customer</p><p className="mt-1 text-[#F5F0E6]">{caseItem.transaction?.customerEmail ?? caseItem.transaction?.customerName ?? "-"}</p></div>
                </div>
              </Card>

              <Card title="Recovery Attempts" className="space-y-3">
                {attempts.length ? attempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-[#171613] p-3 text-sm">
                    <div>
                      <div className="font-medium text-[#F5F0E6]">{label(attempt.action)}</div>
                      <div className="text-[#B7AEA2]">Attempt {attempt.attemptNumber} &middot; {attempt.amount == null ? "No amount" : formatCurrency(Number(attempt.amount))}</div>
                      {attempt.failureReason ? <div className="mt-1 text-[#B7AEA2]">{attempt.failureReason}</div> : null}
                    </div>
                    <Badge tone={attempt.outcome === "SUCCESS" ? "green" : attempt.outcome === "FAILED" ? "red" : "amber"}>{label(attempt.outcome)}</Badge>
                  </div>
                )) : <p className="text-sm text-[#B7AEA2]">No recovery attempts recorded.</p>}
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Update case" className="p-5">
                <form onSubmit={handleCaseUpdate} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-[#B7AEA2]">Status</label>
                    <select value={caseForm.status} onChange={(event) => setCaseForm({ ...caseForm, status: event.target.value as BackendRecoveryStatus })} className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none">
                      {recoveryStatuses.map((status) => <option key={status} value={status}>{label(status)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[#B7AEA2]">Outcome</label>
                    <select value={caseForm.outcome} onChange={(event) => setCaseForm({ ...caseForm, outcome: event.target.value as BackendRecoveryOutcome })} className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none">
                      {recoveryOutcomes.map((outcome) => <option key={outcome} value={outcome}>{label(outcome)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[#B7AEA2]">Selected action</label>
                    <select value={caseForm.selectedAction} onChange={(event) => setCaseForm({ ...caseForm, selectedAction: event.target.value as "" | BackendRecoveryAction })} className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none">
                      <option value="">No recommendation</option>
                      {recoveryActions.map((action) => <option key={action} value={action}>{label(action)}</option>)}
                    </select>
                  </div>
                  <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save case"}</Button>
                </form>
              </Card>

              <Card title="Create attempt" className="p-5">
                <form onSubmit={handleAttemptCreate} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-[#B7AEA2]">Action</label>
                    <select value={attemptForm.action} onChange={(event) => setAttemptForm({ ...attemptForm, action: event.target.value as BackendRecoveryAction })} className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none">
                      {recoveryActions.map((action) => <option key={action} value={action}>{label(action)}</option>)}
                    </select>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm text-[#B7AEA2]">Attempt number</label>
                      <input value={attemptForm.attemptNumber} onChange={(event) => setAttemptForm({ ...attemptForm, attemptNumber: event.target.value })} type="number" min="1" step="1" placeholder="Auto" className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none placeholder:text-[#7E786F]" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-[#B7AEA2]">Amount</label>
                      <input value={attemptForm.amount} onChange={(event) => setAttemptForm({ ...attemptForm, amount: event.target.value })} type="number" min="0.01" step="0.01" placeholder="Optional" className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none placeholder:text-[#7E786F]" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[#B7AEA2]">Outcome</label>
                    <select value={attemptForm.outcome} onChange={(event) => setAttemptForm({ ...attemptForm, outcome: event.target.value as BackendRecoveryOutcome })} className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none">
                      {recoveryOutcomes.map((outcome) => <option key={outcome} value={outcome}>{label(outcome)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-[#B7AEA2]">Failure reason</label>
                    <input value={attemptForm.failureReason} onChange={(event) => setAttemptForm({ ...attemptForm, failureReason: event.target.value })} placeholder="Optional" className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none placeholder:text-[#7E786F]" />
                  </div>
                  <Button type="submit" disabled={creatingAttempt}>{creatingAttempt ? "Creating..." : "Create attempt"}</Button>
                </form>
              </Card>

              <Link href={`/transactions/${caseItem.transactionId}`} className="inline-flex text-sm text-[#D7A455] hover:text-[#E0B76B]">View transaction</Link>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
