import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";
import { getRecoveryDecisionByTransactionId } from "@/services/recovery";
import { getTransactionById } from "@/services/transactions";

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await getTransactionById(id);

  if (!transaction) {
    notFound();
  }

  const decision = await getRecoveryDecisionByTransactionId(transaction.id);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Transaction #{transaction.id}</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#F5F0E6]">{formatCurrency(transaction.amount)}</h2>
          </div>
          <StatusBadge status={transaction.status} />
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <Card title="Payment information" className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Payment method</p><p className="mt-1 text-[#F5F0E6]">{transaction.paymentMethod}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Failure reason</p><p className="mt-1 text-[#F5F0E6]">{transaction.failureReason}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Recovery status</p><p className="mt-1 text-[#F5F0E6]">{transaction.recoveryStatus}</p></div>
                <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Created</p><p className="mt-1 text-[#F5F0E6]">{new Date(transaction.createdAt).toLocaleString("en-IN")}</p></div>
              </div>
            </Card>

            <Card title="AI Decision" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Recovery probability</p>
                  <p className="mt-2 text-3xl font-semibold text-[#F5F0E6]">{transaction.recoveryProbability}%</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Recommended action</p>
                  <p className="mt-2 text-xl font-medium text-[#F5F0E6]">{transaction.recommendedAction}</p>
                </div>
              </div>

              {decision ? (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Why?</p>
                    <ul className="mt-2 space-y-2 text-sm text-[#D5CFC4]">
                      {decision.reasoningSignals.map((signal) => (
                        <li key={signal} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#D7A455]" />{signal}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Risk factors</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {decision.riskFactors.map((risk) => (
                        <Badge key={risk} tone="red">{risk}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </Card>

            <Card title="Recovery timeline" className="space-y-4">
              {[
                { time: "10:32", label: "Checkout started" },
                { time: "10:34", label: "Payment failed" },
                { time: "10:35", label: "AI analyzed transaction" },
                { time: "10:35", label: "Recovery probability calculated: 84%" },
                { time: "10:36", label: "Retry approved by policy engine" },
                { time: "10:37", label: "Recovery attempt executed" },
                { time: "10:38", label: "Payment successful" },
                { time: "10:38", label: `${formatCurrency(transaction.amount)} recovered` },
              ].map((item) => (
                <div key={item.time} className="flex gap-3 border-b border-white/5 pb-3 last:border-none last:pb-0">
                  <div className="min-w-[48px] text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">{item.time}</div>
                  <div className="h-2.5 w-2.5 rounded-full bg-[#D7A455] mt-1.5" />
                  <div className="text-sm text-[#F5F0E6]">{item.label}</div>
                </div>
              ))}
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Customer information" className="space-y-3">
              <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Customer</p><p className="mt-1 text-[#F5F0E6]">{transaction.customerName}</p></div>
              <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Lifetime value</p><p className="mt-1 text-[#F5F0E6]">{formatCurrency(64320)}</p></div>
              <div><p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">Payment history</p><p className="mt-1 text-[#F5F0E6]">6 successful, 2 failed</p></div>
            </Card>

            <Card title="Policy Evaluation" className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm"><span className="text-[#B7AEA2]">Retry limit</span><span className="text-[#F5F0E6]">1 / 2</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-[#B7AEA2]">Recovery window</span><span className="text-[#F5F0E6]">Within allowed window</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-[#B7AEA2]">Action</span><span className="text-[#4AB58D]">APPROVED</span></div>
              </div>
            </Card>

            <Card title="Recovery Attempts" className="space-y-3">
              {[
                { action: "Database retry", result: "Success", amount: 4999 },
                { action: "Recovery link sent", result: "Pending", amount: 0 },
              ].map((attempt) => (
                <div key={attempt.action} className="flex items-center justify-between rounded-md border border-white/10 bg-[#171613] p-3 text-sm">
                  <div>
                    <div className="font-medium text-[#F5F0E6]">{attempt.action}</div>
                    <div className="text-[#B7AEA2]">{attempt.amount ? formatCurrency(attempt.amount) : "No charge"}</div>
                  </div>
                  <Badge tone={attempt.result === "Success" ? "green" : "amber"}>{attempt.result}</Badge>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
