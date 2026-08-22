"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { getPolicy, updatePolicy, type ApiPolicy } from "@/services/policies";
import { ApiError } from "@/lib/api";

export default function PoliciesPage() {
  const router = useRouter();
  const [policy, setPolicy] = useState<ApiPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPolicyData = () => {
    setError("");
    getPolicy()
      .then((data) => {
        setPolicy(data);
      })
      .catch((cause) => {
        if (cause instanceof ApiError && cause.status === 401) {
          router.replace("/login");
          return;
        }
        setError(cause instanceof Error ? cause.message : "Unable to load policies.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPolicyData();
  }, [router]);

  const handleSave = async (mode: string) => {
    setError("");
    setSuccess("");
    try {
      setSaving(true);
      const updated = await updatePolicy({
        mode: mode as any,
      });
      setPolicy(updated);
      setSuccess("Policy updated successfully.");
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        router.replace("/login");
        return;
      }
      setError(cause instanceof Error ? cause.message : "Failed to update policy.");
    } finally {
      setSaving(false);
    }
  };

  const config = policy?.configuration || {};

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[#F5F0E6]">Recovery Policies</h2>
            <p className="mt-1 text-[#B7AEA2]">
              Configured guardrails governing automated AI recovery decisions.
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-4 py-3 text-sm text-[#F7B0A5]">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {success}
          </div>
        ) : null}

        {loading ? (
          <Card className="p-5 text-sm text-[#B7AEA2]">Loading recovery policy...</Card>
        ) : !policy ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold text-[#F5F0E6]">No policy configured</h3>
            <p className="mt-2 text-sm text-[#B7AEA2]">
              Initialize a recovery policy to set execution bounds for automated payment recovery.
            </p>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("ASSISTED")}
              className="mt-4 rounded-md bg-[#E4AD52] px-5 py-2.5 text-sm font-medium text-black disabled:opacity-50"
            >
              {saving ? "Creating..." : "Initialize Default Policy"}
            </button>
          </Card>
        ) : (
          <div className="grid min-w-0 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#F5F0E6]">{policy.name}</h3>
                <span className="rounded bg-white/10 px-2.5 py-1 text-xs text-[#E4AD52]">
                  {policy.status}
                </span>
              </div>
              <p className="mb-6 text-sm text-[#B7AEA2]">{policy.description}</p>

              <div className="space-y-4">
                {[
                  { label: "Maximum retry attempts", value: config.maximumRetryAttempts ?? "Default (2)" },
                  { label: "Maximum customer messages", value: config.maximumCustomerMessages ?? "Default (2)" },
                  { label: "Maximum discount", value: config.maximumDiscount ? `₹${config.maximumDiscount}` : "Not configured" },
                  { label: "Recovery window", value: config.recoveryWindowHours ? `${config.recoveryWindowHours} hours` : "48 hours" },
                  { label: "Maximum auto-recovery amount", value: config.maximumAutoRecoveryAmount ? `₹${config.maximumAutoRecoveryAmount}` : "Not configured" },
                  { label: "Require approval above", value: config.requireApprovalAbove ? `₹${config.requireApprovalAbove}` : "Not configured" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-2 border-b border-white/5 pb-3 last:border-none last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm text-[#B7AEA2]">{item.label}</span>
                    <span className="text-base font-medium text-[#F5F0E6]">{String(item.value)}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-4 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#B7AEA2]">Recovery Mode</p>
              <div className="rounded-md border border-white/10 bg-[#171613] p-4 text-lg font-medium text-[#F5F0E6]">
                {policy.mode}
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs text-[#B7AEA2]">Change operating mode:</p>
                <div className="flex flex-wrap gap-2">
                  {["MANUAL", "ASSISTED", "AUTONOMOUS"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      disabled={saving || policy.mode === mode}
                      onClick={() => handleSave(mode)}
                      className={`rounded-md px-3 py-2 text-xs font-medium transition ${
                        policy.mode === mode
                          ? "bg-[#E4AD52] text-black"
                          : "border border-white/10 bg-[#121210] text-[#B7AEA2] hover:text-white"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-md border border-[#D7A455]/20 bg-[#D7A455]/10 p-4 text-xs text-[#F3C77F]">
                AI recommendations are always evaluated against merchant policies before execution.
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
