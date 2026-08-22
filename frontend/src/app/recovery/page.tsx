"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RecoveryCaseCard } from "@/components/recovery/RecoveryCaseCard";
import { Card } from "@/components/ui/Card";
import { createRecoveryCase, getRecoveryCases } from "@/services/recovery";
import type { ApiRecoveryCase, PaginatedResponse } from "@/types/backend";
import { ApiError } from "@/lib/api";

export default function RecoveryPage() {
  const router = useRouter();
  const [result, setResult] = useState<PaginatedResponse<ApiRecoveryCase> | null>(null);
  const [status, setStatus] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [creating, setCreating] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setResult(null);
    setError("");
    getRecoveryCases({ status }).then(setResult).catch((cause) => {
      if (cause instanceof ApiError && cause.status === 401) router.replace("/login");
      setError(cause instanceof Error ? cause.message : "Unable to load recovery cases.");
    });
  }, [reloadKey, router, status]);

  async function handleCreateCase(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!transactionId.trim()) {
      setError("Transaction ID is required.");
      return;
    }

    try {
      setCreating(true);
      await createRecoveryCase({ transactionId: transactionId.trim() });
      setTransactionId("");
      setReloadKey((current) => current + 1);
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        router.replace("/login");
        return;
      }
      setError(cause instanceof Error ? cause.message : "Unable to create recovery case.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#F5F0E6]">AI Recovery Center</h2>
          <p className="mt-1 text-[#B7AEA2]">Review, approve and monitor recovery decisions.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {['All', 'RECOMMENDED', 'AWAITING_APPROVAL', 'RECOVERED'].map((tab) => (
            <button type="button" key={tab} onClick={() => setStatus(tab === "All" ? undefined : tab)} className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-sm text-[#F5F0E6]">
              {tab}
            </button>
          ))}
        </div>

        <Card title="Create recovery case" className="p-5">
          <form onSubmit={handleCreateCase} className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="min-w-0 flex-1">
              <label className="mb-1 block text-sm text-[#B7AEA2]">Transaction ID</label>
              <input
                value={transactionId}
                onChange={(event) => setTransactionId(event.target.value)}
                placeholder="Paste the failed transaction UUID"
                className="w-full rounded-md border border-white/10 bg-[#171613] px-3 py-3 text-sm text-[#F5F0E6] outline-none placeholder:text-[#7E786F]"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="rounded-md bg-[#E4AD52] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#efbb65] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create case"}
            </button>
          </form>
        </Card>

        <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {result?.items.map((caseItem) => (
            <RecoveryCaseCard key={caseItem.id} caseItem={caseItem} onUpdated={() => setReloadKey((current) => current + 1)} />
          ))}
        </div>

        {error ? <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-3 py-2 text-sm text-[#F7B0A5]">{error}</div> : null}
        {!result && !error ? <Card className="p-5 text-sm text-[#B7AEA2]">Loading recovery cases...</Card> : null}
        {result?.items.length === 0 ? <Card className="p-5 text-sm text-[#B7AEA2]">No recovery cases found.</Card> : null}

        <Card title="Operational guardrails" className="p-5">
          <p className="text-sm text-[#B7AEA2]">
            AI recommendations are always evaluated against merchant policies before execution. Recovery actions remain monitorable and reversible until a final approval is confirmed.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
