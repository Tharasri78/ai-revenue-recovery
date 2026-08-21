import { AppShell } from "@/components/layout/AppShell";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { RecoveryActivity } from "@/components/dashboard/RecoveryActivity";
import { RecoveryFunnel } from "@/components/dashboard/RecoveryFunnel";
import { RecoveryReasonsChart } from "@/components/dashboard/RecoveryReasonsChart";
import { RevenueTrendChart } from "@/components/dashboard/RevenueTrendChart";
import { Card } from "@/components/ui/Card";
import { getAnalyticsData } from "@/services/analytics";

export default async function DashboardPage() {
  const analytics = await getAnalyticsData();

  return (
    <AppShell>
      <div className="space-y-6">
        <KPIGrid items={analytics.kpis} />

        <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <RevenueTrendChart data={analytics.revenueTrend} />
          <RecoveryFunnel items={analytics.funnel} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <RecoveryActivity
            items={[
              {
                transactionId: "TXN_10291",
                amount: 4999,
                problem: "Temporary payment failure",
                recommendation: "Retry payment",
                confidence: 84,
                policy: "Approved",
                status: "Recovered",
              },
              {
                transactionId: "TXN_10305",
                amount: 12800,
                problem: "Authentication failure",
                recommendation: "Send recovery link",
                confidence: 71,
                policy: "Approved",
                status: "Pending",
              },
              {
                transactionId: "TXN_10322",
                amount: 8600,
                problem: "Abandoned checkout",
                recommendation: "Offer alternative payment",
                confidence: 63,
                policy: "Needs review",
                status: "Recommended",
              },
            ]}
          />
          <RecoveryReasonsChart data={analytics.recoveryReasons} />
        </div>

        <Card title="Recent recovery activity" className="p-0">
          <div className="space-y-3 p-4 text-sm text-[#D5CFC4]">
            {[
              "10:38 · TXN_10291 · Payment success after retry approved by policy engine",
              "11:12 · TXN_10305 · Recovery link queued for customer follow-up",
              "12:03 · TXN_10322 · Ops review triggered for alternative payment path",
            ].map((entry) => (
              <div key={entry} className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-none last:pb-0">
                <span>{entry}</span>
                <span className="rounded-full border border-white/10 bg-[#171613] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#B7AEA2]">Live</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
