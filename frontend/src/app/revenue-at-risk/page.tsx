"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { getTransactions } from "@/services/transactions";
import { getDashboardData } from "@/services/analytics";
import type { ApiTransaction, PaginatedResponse } from "@/types/backend";
import { ApiError } from "@/lib/api";

export default function RevenueAtRiskPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [result, setResult] = useState<PaginatedResponse<ApiTransaction> | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const fetchData = useCallback(() => {
    getDashboardData()
      .then(setDashboardData)
      .catch((cause) => {
        if (cause instanceof ApiError && cause.status === 401) router.replace("/login");
      });

    const query: Record<string, any> = { limit: 100 };
    if (search) query.search = search;
    if (selectedStatus) query.status = selectedStatus;
    if (selectedMethod) query.paymentMethod = selectedMethod;

    getTransactions(query)
      .then((res) => {
        // Filter for at-risk (FAILED/ABANDONED) if no specific status was selected
        if (!selectedStatus) {
          const atRiskItems = res.items.filter((item) =>
            ["FAILED", "ABANDONED"].includes(item.paymentStatus)
          );
          setResult({ ...res, items: atRiskItems, total: atRiskItems.length });
        } else {
          setResult(res);
        }
      })
      .catch((cause) => {
        if (cause instanceof ApiError && cause.status === 401) router.replace("/login");
        setError(cause instanceof Error ? cause.message : "Unable to load revenue at risk.");
      });
  }, [router, search, selectedMethod, selectedStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kpis = dashboardData?.kpis ?? [];
  const revenueAtRiskKpi = kpis.find((k: any) => k.label === "Revenue at Risk")?.value ?? "-";
  const potentiallyRecoverableKpi = kpis.find((k: any) => k.label === "Potentially Recoverable")?.value ?? "Not available";
  const recoveryRateKpi = kpis.find((k: any) => k.label === "Recovery Rate")?.value ?? "0%";
  const atRiskCount = result?.total ?? 0;

  const rows = (result?.items ?? []).map((txn) => {
    const score = txn.recoveryCase?.recoveryScore ?? txn.recoveryCase?.confidence;
    const probabilityDisplay = score !== null && score !== undefined
      ? `${(Number(score) * 100).toFixed(0)}%`
      : "Not available";

    const actionDisplay = txn.recoveryCase?.selectedAction
      ? txn.recoveryCase.selectedAction.replaceAll("_", " ")
      : "Pending";

    return {
      id: (
        <Link href={`/transactions/${txn.id}`} className="font-medium text-[#F5F0E6] hover:text-[#D7A455]">
          {txn.externalReference || txn.id}
        </Link>
      ),
      customer: txn.customerName ?? txn.customerEmail ?? "Unknown customer",
      amount: formatCurrency(Number(txn.amount)),
      reason: txn.failureReason ?? "-",
      probability: probabilityDisplay,
      action: actionDisplay,
      status: <StatusBadge status={txn.paymentStatus.replaceAll("_", " ")} />,
      created: new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Revenue at Risk", value: revenueAtRiskKpi },
            { label: "Potentially Recoverable", value: potentiallyRecoverableKpi },
            { label: "At-Risk Transactions", value: String(atRiskCount) },
            { label: "Recovery Rate", value: recoveryRateKpi },
          ].map((metric) => (
            <Card key={metric.label} className="p-4">
              <p className="text-sm text-[#B7AEA2]">{metric.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[#F5F0E6]">{metric.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Filter by payment method"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-xs text-[#B7AEA2] outline-none"
              >
                <option value="">All Payment Methods</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="WALLET">Wallet</option>
                <option value="EMI">EMI</option>
              </select>

              <select
                aria-label="Filter by status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-xs text-[#B7AEA2] outline-none"
              >
                <option value="">All At-Risk Statuses</option>
                <option value="FAILED">FAILED</option>
                <option value="ABANDONED">ABANDONED</option>
              </select>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transaction or customer"
              aria-label="Search transactions"
              className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2 text-sm text-[#F5F0E6] outline-none placeholder:text-[#7E786F] md:max-w-xs"
            />
          </div>
        </Card>

        {error ? <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-3 py-2 text-sm text-[#F7B0A5]">{error}</div> : null}
        {!result && !error ? <Card className="p-5 text-sm text-[#B7AEA2]">Loading revenue at risk...</Card> : null}
        {result?.items.length === 0 ? <Card className="p-5 text-sm text-[#B7AEA2]">No at-risk transactions found.</Card> : null}
        {result && rows.length > 0 ? (
          <DataTable
            columns={[
              { key: "id", label: "Transaction" },
              { key: "customer", label: "Customer" },
              { key: "amount", label: "Amount" },
              { key: "reason", label: "Failure reason" },
              { key: "probability", label: "Recovery probability" },
              { key: "action", label: "Recommended action" },
              { key: "status", label: "Status" },
              { key: "created", label: "Created" },
            ]}
            rows={rows}
          />
        ) : null}
      </div>
    </AppShell>
  );
}

