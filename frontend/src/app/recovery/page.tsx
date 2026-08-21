import { AppShell } from "@/components/layout/AppShell";
import { RecoveryCaseCard } from "@/components/recovery/RecoveryCaseCard";
import { Card } from "@/components/ui/Card";
import { getRecoveryCases } from "@/services/recovery";

export default async function RecoveryPage() {
  const cases = await getRecoveryCases();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#F5F0E6]">AI Recovery Center</h2>
          <p className="mt-1 text-[#B7AEA2]">Review, approve and monitor recovery decisions.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {['Recommended', 'Awaiting approval', 'Completed'].map((tab) => (
            <button key={tab} className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-sm text-[#F5F0E6]">
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {cases.map((caseItem) => (
            <RecoveryCaseCard key={caseItem.id} caseItem={caseItem} />
          ))}
        </div>

        <Card title="Operational guardrails" className="p-5">
          <p className="text-sm text-[#B7AEA2]">
            AI recommendations are always evaluated against merchant policies before execution. Recovery actions remain monitorable and reversible until a final approval is confirmed.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
