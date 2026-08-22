"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";

export default function ExperimentsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#F5F0E6]">Recovery Experiment Lab</h2>
            <p className="mt-1 text-[#B7AEA2]">
              A/B testing and strategy evaluation for AI recovery performance.
            </p>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Transactions tested", value: "Not available" },
            { label: "Baseline recovered", value: "Not available" },
            { label: "AI recovered", value: "Not available" },
            { label: "Improvement", value: "Not available" },
          ].map((metric) => (
            <Card key={metric.label} className="p-4">
              <p className="text-sm text-[#B7AEA2]">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">{metric.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold text-[#F5F0E6]">No active experiments configured</h3>
          <p className="mt-2 max-w-xl mx-auto text-sm text-[#B7AEA2]">
            Experiment simulation metrics and A/B test split results require live experiment execution.
            Currently, no active experiment models are running in the database.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
