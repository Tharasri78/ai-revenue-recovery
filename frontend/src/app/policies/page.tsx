import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { getPolicy } from "@/services/policies";

export default async function PoliciesPage() {
  const policy = await getPolicy();

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#F5F0E6]">Recovery Policies</h2>
          <p className="mt-1 text-[#B7AEA2]">What the AI is allowed to do before a recovery action is executed.</p>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-5">
            <div className="space-y-5">
              {[
                { label: "Maximum retry attempts", value: `${policy.maximumRetryAttempts}` },
                { label: "Maximum customer messages", value: `${policy.maximumCustomerMessages}` },
                { label: "Maximum discount", value: `₹${policy.maximumDiscount}` },
                { label: "Recovery window", value: `${policy.recoveryWindowHours} hours` },
                { label: "Maximum auto-recovery amount", value: `₹${policy.maximumAutoRecoveryAmount}` },
                { label: "Require approval above", value: `₹${policy.requireApprovalAbove}` },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-2 border-b border-white/5 pb-3 last:border-none last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-[#B7AEA2]">{item.label}</span>
                  <span className="text-base font-medium text-[#F5F0E6] sm:text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Recovery mode</p>
            <div className="mt-4 rounded-md border border-white/10 bg-[#171613] p-4 text-lg font-medium text-[#F5F0E6]">
              {policy.mode}
            </div>
            <div className="mt-4 rounded-md border border-[#D7A455]/20 bg-[#D7A455]/10 p-4 text-sm text-[#F3C77F]">
              AI recommendations are always evaluated against merchant policies before execution.
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
