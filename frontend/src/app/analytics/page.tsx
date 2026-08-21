import { AppShell } from "@/components/layout/AppShell";
import { RecoveryStrategyChart } from "@/components/analytics/RecoveryStrategyChart";
import { RevenueAnalytics } from "@/components/analytics/RevenueAnalytics";
import { Card } from "@/components/ui/Card";
import { getAnalyticsData } from "@/services/analytics";

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsData();

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            { label: "Total revenue at risk", value: "₹18.4L" },
            { label: "Revenue recovered", value: "₹6.72L" },
            { label: "Recovery rate", value: "59.8%" },
            { label: "Avg recovery amount", value: "₹4.3K" },
            { label: "Avg recovery cost", value: "₹386" },
            { label: "Net recovered revenue", value: "₹5.8L" },
          ].map((metric) => (
            <Card key={metric.label} className="p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">{metric.label}</p>
              <p className="mt-3 text-2xl font-semibold text-[#F5F0E6]">{metric.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <RevenueAnalytics data={analytics.revenueTrend} />
          <Card title="Recovery rate over time" className="h-[320px] p-4">
            <div className="flex h-full items-center justify-center text-[#B7AEA2]">Mock trend data for recovery rate progression</div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <RecoveryStrategyChart data={analytics.recoveryStrategies} />
          <Card title="Recovery by failure reason" className="h-[280px] p-4">
            <div className="flex h-full items-center justify-center text-[#B7AEA2]">Failure reason breakout</div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Recovery by payment method" className="h-[280px] p-4">
            <div className="flex h-full items-center justify-center text-[#B7AEA2]">Payment method mix</div>
          </Card>
          <Card title="Recovery outcome distribution" className="h-[280px] p-4">
            <div className="flex h-full items-center justify-center text-[#B7AEA2]">Outcome distribution</div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
