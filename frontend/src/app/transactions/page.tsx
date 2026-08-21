"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Card } from "@/components/ui/Card";
import { getTransactions } from "@/services/transactions";
import type { ApiTransaction, PaginatedResponse } from "@/types/backend";
import { ApiError } from "@/lib/api";

export default function TransactionsPage() {
  const router = useRouter();
  const [result, setResult] = useState<PaginatedResponse<ApiTransaction> | null>(null);
  const [status, setStatus] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    getTransactions({ status, search: search || undefined }).then(setResult).catch((cause) => {
      if (cause instanceof ApiError && cause.status === 401) router.replace("/login");
      setError(cause instanceof Error ? cause.message : "Unable to load transactions.");
    });
  }, [router, search, status]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "All", value: "1,248" },
            { label: "Successful", value: "982" },
            { label: "Failed", value: "121" },
            { label: "Abandoned", value: "94" },
            { label: "Recovered", value: "51" },
          ].map((metric) => (
            <Card key={metric.label} className="p-4">
              <p className="text-sm text-[#B7AEA2]">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">{metric.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap gap-3">
              {['All', 'SUCCESSFUL', 'FAILED', 'ABANDONED', 'RECOVERY_ATTEMPTED', 'RECOVERED'].map((filter) => (
              <button type="button" key={filter} onClick={() => setStatus(filter === "All" ? undefined : filter)} className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">
                {filter}
              </button>
            ))}
              </div>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search transaction" aria-label="Search transactions" className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2 text-sm text-[#F5F0E6] outline-none placeholder:text-[#7E786F] md:max-w-xs" />
        </Card>

        {error ? <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-3 py-2 text-sm text-[#F7B0A5]">{error}</div> : null}
        {!result && !error ? <Card className="p-5 text-sm text-[#B7AEA2]">Loading transactions...</Card> : null}
        {result && result.items.length === 0 ? <Card className="p-5 text-sm text-[#B7AEA2]">No transactions found.</Card> : null}
        {result && result.items.length > 0 ? <TransactionTable items={result.items} /> : null}
      </div>
    </AppShell>
  );
}
