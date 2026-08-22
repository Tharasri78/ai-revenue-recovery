"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { FailureReasonsChart } from "@/components/analytics/FailureReasonsChart";
import { OutcomeDistributionChart } from "@/components/analytics/OutcomeDistributionChart";
import { PaymentMethodChart } from "@/components/analytics/PaymentMethodChart";
import { RecoveryStrategyChart } from "@/components/analytics/RecoveryStrategyChart";
import { RevenueAnalytics } from "@/components/analytics/RevenueAnalytics";
import { getDashboardData } from "@/services/analytics";
import { ApiError } from "@/lib/api";

export default function AnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getDashboardData()
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((cause) => {
        if (cause instanceof ApiError && cause.status === 401) {
          router.replace("/login");
          return;
        }
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to load analytics data."
        );
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center text-sm text-[#B7AEA2]">
          Loading analytics…
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-4 py-3 text-sm text-[#F7B0A5]">
          {error}
        </div>
      </AppShell>
    );
  }

  if (!analytics) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center text-sm text-[#B7AEA2]">
          No analytics data loaded.
        </div>
      </AppShell>
    );
  }

  // kpis from the backend – exactly 4 items: Revenue at Risk, Potentially Recoverable,
  // Revenue Recovered, Recovery Rate. Show only the first 4.
  const kpis: Array<{ label: string; value: string; description: string }> =
    analytics.kpis ?? [];

  const revenueTrend: Array<{ label: string; revenueAtRisk: number; recovered: number }> =
    analytics.revenueTrend ?? [];

  const recoveryStrategies: Array<{ strategy: string; value: number }> =
    analytics.recoveryStrategies ?? [];

  const recoveryReasons: Array<{ name: string; value: number }> =
    analytics.recoveryReasons ?? [];

  const paymentMethods: Array<{ name: string; value: number }> =
    analytics.paymentMethods ?? [];

  const recoveryOutcomes: Array<{ label: string; value: number }> =
    analytics.recoveryOutcomes ?? [];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* KPI cards — sourced from real backend kpis[] */}
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.length === 0 ? (
            <Card className="col-span-full p-4 text-center text-sm text-[#B7AEA2]">
              No KPI data available
            </Card>
          ) : (
            kpis.map((kpi) => (
              <Card key={kpi.label} className="p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">
                  {kpi.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-[#F5F0E6]">
                  {kpi.value}
                </p>
                {kpi.description && (
                  <p className="mt-1 text-[11px] text-[#B7AEA2]">{kpi.description}</p>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Revenue trend + recovery rate over time */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* RevenueAnalytics uses real revenueTrend buckets from the backend */}
          <RevenueAnalytics data={revenueTrend} />

          {/* "Recovery rate over time" – insufficient time-series data in current schema;
              show an honest empty state rather than fabricated data */}
          <Card title="Recovery rate over time" className="h-[320px] p-4">
            <div className="flex h-full items-center justify-center text-sm text-[#B7AEA2]">
              Not available — insufficient time-series recovery data
            </div>
          </Card>
        </div>

        {/* Recovery strategy + failure reason */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Uses real recovery attempt actions grouped by type */}
          <RecoveryStrategyChart data={recoveryStrategies} />
          {/* Uses real failureReason field from FAILED/ABANDONED transactions */}
          <FailureReasonsChart data={recoveryReasons} />
        </div>

        {/* Payment method + outcome distribution */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Uses real paymentMethod field from FAILED/ABANDONED transactions */}
          <PaymentMethodChart data={paymentMethods} />
          {/* Uses real recovery attempt counts grouped by outcome */}
          <OutcomeDistributionChart data={recoveryOutcomes} />
        </div>
      </div>
    </AppShell>
  );
}
