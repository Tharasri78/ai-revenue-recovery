"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { authGetCurrentUser } from "@/services/auth";
import type { AuthSession } from "@/types/auth";
import { ApiError } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    authGetCurrentUser()
      .then((data) => {
        if (!data) {
          router.replace("/login");
          return;
        }
        setSession(data);
      })
      .catch((cause) => {
        if (cause instanceof ApiError && cause.status === 401) {
          router.replace("/login");
          return;
        }
        setError(cause instanceof Error ? cause.message : "Failed to load merchant profile.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#B7AEA2]">MERCHANT SETTINGS</p>
          <h1 className="mt-1 text-3xl font-semibold text-[#F5F0E6]">Account & Profile</h1>
        </div>

        {error ? (
          <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-4 py-3 text-sm text-[#F7B0A5]">
            {error}
          </div>
        ) : null}

        {loading ? (
          <Card className="p-5 text-sm text-[#B7AEA2]">Loading merchant profile...</Card>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-2">
              <Card title="Merchant Profile (Real Data)" className="space-y-4 p-5">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-[#B7AEA2]">Business Name</label>
                  <input
                    readOnly
                    className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6] outline-none"
                    value={session?.merchantName || "Not configured"}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-[#B7AEA2]">Business Email</label>
                  <input
                    readOnly
                    className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6] outline-none"
                    value={session?.email || "Not configured"}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-[#B7AEA2]">Account Status</label>
                  <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    ACTIVE
                  </div>
                </div>
              </Card>

              <Card title="Store & System Metadata" className="space-y-4 p-5">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-[#B7AEA2]">Primary Region</label>
                  <input
                    readOnly
                    className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#888] outline-none"
                    value="Not configured"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-[#B7AEA2]">Account Tier</label>
                  <input
                    readOnly
                    className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#888] outline-none"
                    value="Not configured"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-[#B7AEA2]">Business Category</label>
                  <input
                    readOnly
                    className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#888] outline-none"
                    value="Not configured"
                  />
                </div>
              </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <Card title="Payment Gateway Integration" className="p-5">
                <div className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-[#121210] p-4">
                  <div>
                    <p className="text-sm font-medium text-[#F5F0E6]">Payment Gateway Connection</p>
                    <p className="mt-1 text-xs text-[#B7AEA2]">Gateway webhook & API integration status</p>
                  </div>
                  <span className="rounded bg-white/5 px-2.5 py-1 text-xs text-[#888]">Not configured</span>
                </div>
              </Card>

              <Card title="Notification Preferences" className="p-5">
                <div className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-[#121210] p-4">
                  <div>
                    <p className="text-sm font-medium text-[#F5F0E6]">Notification Delivery Settings</p>
                    <p className="mt-1 text-xs text-[#B7AEA2]">Email and webhook exception alerts</p>
                  </div>
                  <span className="rounded bg-white/5 px-2.5 py-1 text-xs text-[#888]">Not configured</span>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}

