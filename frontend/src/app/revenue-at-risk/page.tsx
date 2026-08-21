import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { getTransactions } from "@/services/transactions";

export default async function RevenueAtRiskPage() {
  const transactions = await getTransactions();
  const atRisk = transactions.filter((txn) => txn.isRecoverable);

  const rows = atRisk.map((txn) => ({
    id: (
      <Link href={`/transactions/${txn.id}`} className="font-medium text-[#F5F0E6] hover:text-[#D7A455]">
        {txn.id}
      </Link>
    ),
    customer: txn.customerName,
    amount: formatCurrency(txn.amount),
    reason: txn.failureReason,
    probability: `${txn.recoveryProbability}%`,
    action: txn.recommendedAction,
    status: <StatusBadge status={txn.policyResult === "Approved" ? "Approved" : txn.policyResult === "Needs review" ? "Needs review" : "Blocked"} />,
    created: new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
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
            <div className="flex flex-wrap gap-3">
              {['Date', 'Amount', 'Payment method', 'Failure reason', 'Recovery probability', 'Status'].map((filter) => (
                <button key={filter} className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">
                  {filter}
                </button>
              ))}
            </div>
            <input
              placeholder="Search transaction"
              aria-label="Search transactions"
              className="w-full max-w-xs rounded-md border border-white/10 bg-[#121210] px-3 py-2 text-sm text-[#F5F0E6] outline-none placeholder:text-[#7E786F] md:w-64"
            />
          </div>
        </Card>

        <DataTable
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
        />
      </div>
    </AppShell>
  );
}
