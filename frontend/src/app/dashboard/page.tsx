"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { KPIGrid } from "@/components/dashboard/KPIGrid";
import { RecoveryActivity } from "@/components/dashboard/RecoveryActivity";
import { RecoveryFunnel } from "@/components/dashboard/RecoveryFunnel";
import { RecoveryReasonsChart } from "@/components/dashboard/RecoveryReasonsChart";
import { RevenueTrendChart } from "@/components/dashboard/RevenueTrendChart";
import { Card } from "@/components/ui/Card";
import { getDashboardData } from "@/services/analytics";
import { ApiError } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
            : "Unable to load dashboard analytics."
        );
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center text-sm text-[#B7AEA2]">
          Loading dashboard analytics...
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
          No dashboard analytics data loaded.
        </div>
      </AppShell>
    );
  }

  const hasNoData = !analytics.totals || analytics.totals.transactions === 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <KPIGrid items={analytics.kpis || []} />

        {hasNoData ? (
          <Card className="p-8 text-center">
            <p className="text-[#F5F0E6] font-medium text-lg">No transaction data available yet.</p>
            <p className="mt-2 text-sm text-[#B7AEA2]">
              Failed or abandoned payment flows will appear here once processed.
            </p>
          </Card>
        ) : (
          <>
            <div className="grid min-w-0 gap-6 lg:grid-cols-[1.7fr_1fr]">
              <RevenueTrendChart data={analytics.revenueTrend || []} />
              <RecoveryFunnel items={analytics.funnel || []} />
            </div>

            <div className="grid min-w-0 gap-6 lg:grid-cols-[1.6fr_1fr]">
              <RecoveryActivity items={analytics.recoveryActivity || []} />
              <RecoveryReasonsChart data={analytics.recoveryReasons || []} />
            </div>

            <Card title="Recent recovery activity" className="p-0">
              <div className="space-y-3 p-4 text-sm text-[#D5CFC4]">
                {!analytics.recentActivity || analytics.recentActivity.length === 0 ? (
                  <p className="text-sm text-[#B7AEA2] py-2">No recent recovery activity recorded.</p>
                ) : (
                  analytics.recentActivity.map((entry: any) => (
                    <div
                      key={entry.id}
                      className="flex flex-col gap-2 border-b border-white/5 pb-3 last:border-none last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="min-w-0 break-words">{entry.text}</span>
                      <span className="rounded-full border border-white/10 bg-[#171613] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#B7AEA2]">
                        Live
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}
