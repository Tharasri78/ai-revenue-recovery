import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAnalyticsData } from "@/services/analytics";

export default async function ExperimentsPage() {
  const analytics = await getAnalyticsData();

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#F5F0E6]">Recovery Experiment Lab</h2>
            <p className="mt-1 text-[#B7AEA2]">Compare the AI recovery agent against a baseline rule-driven strategy.</p>
          </div>
          <Button variant="primary">Run simulation</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Transactions tested", value: "5,000" },
            { label: "Baseline recovered", value: "₹1.82L" },
            { label: "AI recovered", value: "₹3.21L" },
            { label: "Improvement", value: "+76.4%" },
          ].map((metric) => (
            <Card key={metric.label} className="p-4">
              <p className="text-sm text-[#B7AEA2]">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">{metric.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Recovery amount comparison" className="h-[260px] p-4">
            <div className="flex h-full items-center justify-center text-[#B7AEA2]">Mock simulation chart: rule-based vs AI recovery amount</div>
          </Card>
          <Card title="Recovery rate comparison" className="h-[260px] p-4">
            <div className="flex h-full items-center justify-center text-[#B7AEA2]">Mock comparison of successful recovery share</div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Unnecessary intervention comparison" className="h-[260px] p-4">
            <div className="flex h-full items-center justify-center text-[#B7AEA2]">Intervention noise and false-positive rate</div>
          </Card>
          <Card title="Average recovery cost" className="h-[260px] p-4">
            <div className="flex h-full items-center justify-center text-[#B7AEA2]">₹386 average cost for AI recovery attempts</div>
          </Card>
        </div>

        <Card title="Demo result note" className="p-5">
          <p className="text-sm text-[#B7AEA2]">This experiment is frontend mock data only. It demonstrates the evaluation flow and does not represent a live model benchmark or production inference.</p>
        </Card>
      </div>
    </AppShell>
  );
}
