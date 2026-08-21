"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ApiError } from "@/lib/api";
import { getTransactionById } from "@/services/transactions";
import type { ApiTransaction } from "@/types/backend";
import { formatCurrency } from "@/lib/utils";

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [transaction, setTransaction] = useState<ApiTransaction | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getTransactionById(id).then(setTransaction).catch((cause) => {
      if (cause instanceof ApiError && cause.status === 401) router.replace("/login");
      setError(cause instanceof Error ? cause.message : "Unable to load transaction.");
    });
  }, [id, router]);

  return (
    <AppShell>
      {error ? <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-3 py-2 text-sm text-[#F7B0A5]">{error}</div> : null}
      {!transaction && !error ? <Card className="p-5 text-sm text-[#B7AEA2]">Loading transaction...</Card> : null}
      {transaction ? <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Transaction #{transaction.id}</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#F5F0E6]">{formatCurrency(Number(transaction.amount))}</h2>
          </div>
          <StatusBadge status={transaction.paymentStatus.replaceAll("_", " ")} />
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <Card title="Payment information" className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Payment method</p><p className="mt-1 text-[#F5F0E6]">{transaction.paymentMethod.replaceAll("_", " ")}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Failure reason</p><p className="mt-1 text-[#F5F0E6]">{transaction.failureReason ?? "-"}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Recovery status</p><p className="mt-1 text-[#F5F0E6]">{transaction.recoveryCase?.status?.replaceAll("_", " ") ?? "None"}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Created</p><p className="mt-1 text-[#F5F0E6]">{new Date(transaction.createdAt).toLocaleString("en-IN")}</p></div>
              </div>
            </Card>

            <Card title="AI Decision" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Recovery probability</p><p className="mt-2 text-3xl font-semibold text-[#F5F0E6]">{transaction.recoveryCase?.recoveryScore == null ? "-" : `${Number(transaction.recoveryCase.recoveryScore) * 100}%`}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Recommended action</p><p className="mt-2 text-xl font-medium text-[#F5F0E6]">{transaction.recoveryCase?.selectedAction?.replaceAll("_", " ") ?? "No recommendation"}</p></div>
              </div>
              <p className="text-sm text-[#B7AEA2]">{transaction.recoveryCase?.recommendationReason ?? "No AI decision has been recorded for this transaction."}</p>
            </Card>

            <Card title="Recovery Attempts" className="space-y-3">
              {transaction.recoveryCase?.attempts?.length ? transaction.recoveryCase.attempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between rounded-md border border-white/10 bg-[#171613] p-3 text-sm">
                  <div><div className="font-medium text-[#F5F0E6]">{attempt.action.replaceAll("_", " ")}</div><div className="text-[#B7AEA2]">Attempt {attempt.attemptNumber} · {attempt.amount == null ? "No charge" : formatCurrency(Number(attempt.amount))}</div></div>
                  <Badge tone={attempt.outcome === "SUCCESS" ? "green" : attempt.outcome === "FAILED" ? "red" : "amber"}>{attempt.outcome}</Badge>
                </div>
              )) : <p className="text-sm text-[#B7AEA2]">No recovery attempts recorded.</p>}
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Customer information" className="space-y-3">
              <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Customer</p><p className="mt-1 text-[#F5F0E6]">{transaction.customerName ?? "Unknown customer"}</p></div>
              <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Email</p><p className="mt-1 text-[#F5F0E6]">{transaction.customerEmail ?? "-"}</p></div>
              <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Reference</p><p className="mt-1 text-[#F5F0E6]">{transaction.customerReference ?? transaction.externalReference ?? "-"}</p></div>
            </Card>
          </div>
        </div>
      </div> : null}
    </AppShell>
  );
}
