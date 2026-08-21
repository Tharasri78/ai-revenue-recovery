import { AppShell } from "@/components/layout/AppShell";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Card } from "@/components/ui/Card";
import { getTransactions } from "@/services/transactions";

export default async function TransactionsPage() {
  const transactions = await getTransactions();

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
            {['All', 'Successful', 'Failed', 'Abandoned', 'Recovery attempted', 'Recovered'].map((filter) => (
              <button key={filter} className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">
                {filter}
              </button>
            ))}
          </div>
        </Card>

        <TransactionTable items={transactions} />
      </div>
    </AppShell>
  );
}
