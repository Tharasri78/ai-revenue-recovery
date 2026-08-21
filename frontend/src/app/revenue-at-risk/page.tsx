"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { getTransactions } from "@/services/transactions";
import type { ApiTransaction, PaginatedResponse } from "@/types/backend";
import { ApiError } from "@/lib/api";

export default function RevenueAtRiskPage() {
  const router = useRouter();
  const [result, setResult] = useState<PaginatedResponse<ApiTransaction> | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    getTransactions({ paymentStatus: "FAILED", limit: 100 }).then(setResult).catch((cause) => {
      if (cause instanceof ApiError && cause.status === 401) router.replace("/login");
      setError(cause instanceof Error ? cause.message : "Unable to load revenue at risk.");
    });
  }, [router]);

  const rows = (result?.items ?? []).map((txn) => ({
    id: (
      <Link href={`/transactions/${txn.id}`} className="font-medium text-[#F5F0E6] hover:text-[#D7A455]">
        {txn.id}
      </Link>
    ),
    customer: txn.customerName ?? txn.customerEmail ?? "Unknown customer",
    amount: formatCurrency(Number(txn.amount)),
    reason: txn.failureReason ?? "-",
    probability: "-",
    action: "Pending decision",
    status: <StatusBadge status={txn.paymentStatus.replaceAll("_", " ")} />,
    created: new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total at risk", value: "₹18.4L" },
            { label: "Potentially recoverable", value: "₹11.2L" },
            { label: "High-value cases", value: "18" },
            { label: "Recovery opportunities", value: "42%" },
          ].map((metric) => (
            <Card key={metric.label} className="p-4">
              <p className="text-sm text-[#B7AEA2]">{metric.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[#F5F0E6]">{metric.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {['Date', 'Amount', 'Payment method', 'Failure reason', 'Recovery probability', 'Status'].map((filter) => (
                <button key={filter} className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[#B7AEA2] sm:text-xs">
                  {filter}
                </button>
              ))}
            </div>
            <input
              placeholder="Search transaction"
              aria-label="Search transactions"
              className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2 text-sm text-[#F5F0E6] outline-none placeholder:text-[#7E786F] md:max-w-xs"
            />
          </div>
        </Card>

        {error ? <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-3 py-2 text-sm text-[#F7B0A5]">{error}</div> : null}
        {!result && !error ? <Card className="p-5 text-sm text-[#B7AEA2]">Loading revenue at risk...</Card> : null}
        {result?.items.length === 0 ? <Card className="p-5 text-sm text-[#B7AEA2]">No at-risk transactions found.</Card> : null}
        {result && rows.length > 0 ? <DataTable
          columns={[
            { key: "id", label: "Transaction ID" },
            { key: "customer", label: "Customer" },
            { key: "amount", label: "Amount" },
            { key: "reason", label: "Failure reason" },
            { key: "probability", label: "Recovery probability" },
            { key: "action", label: "Recommended action" },
            { key: "status", label: "Status" },
            { key: "created", label: "Created" },
          ]}
          rows={rows}
        /> : null}
      </div>
    </AppShell>
  );
}
