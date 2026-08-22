"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { getAuditEvents, type ApiAuditLog } from "@/services/audit";
import type { PaginatedResponse } from "@/types/backend";
import { ApiError } from "@/lib/api";

export default function AuditLogsPage() {
  const router = useRouter();
  const [result, setResult] = useState<PaginatedResponse<ApiAuditLog> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("");

  useEffect(() => {
    setError("");
    getAuditEvents({ entityType: entityFilter || undefined })
      .then(setResult)
      .catch((cause) => {
        if (cause instanceof ApiError && cause.status === 401) {
          router.replace("/login");
          return;
        }
        setError(cause instanceof Error ? cause.message : "Unable to load audit logs.");
      })
      .finally(() => setLoading(false));
  }, [router, entityFilter]);

  const rows = (result?.items ?? []).map((event) => ({
    timestamp: new Date(event.createdAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    entityType: <Badge tone="muted">{event.entityType}</Badge>,
    action: event.action,
    entityId: event.entityId ?? "-",
    actor: event.user?.name ?? event.user?.email ?? "System",
    details: event.metadata ? JSON.stringify(event.metadata) : "-",
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-semibold text-[#F5F0E6]">Audit Logs</h1>
            <p className="mt-1 text-sm text-[#B7AEA2]">
              Immutable audit history for merchant recovery operations and settings changes.
            </p>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-[#B7AEA2]">Filter Entity:</span>
            {["", "RECOVERY_CASE", "RECOVERY_ATTEMPT", "POLICY", "TRANSACTION"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setEntityFilter(type)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-[0.1em] transition ${
                  entityFilter === type
                    ? "bg-[#E4AD52] text-black"
                    : "border border-white/10 bg-[#171613] text-[#B7AEA2] hover:border-[#E4AD52]/50"
                }`}
              >
                {type || "ALL"}
              </button>
            ))}
          </div>
        </Card>

        {error ? (
          <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-4 py-3 text-sm text-[#F7B0A5]">
            {error}
          </div>
        ) : null}

        {loading ? (
          <Card className="p-5 text-sm text-[#B7AEA2]">Loading audit logs...</Card>
        ) : result?.items.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-semibold text-[#F5F0E6]">No audit logs recorded yet</h3>
            <p className="mt-2 text-sm text-[#B7AEA2]">
              New actions, policy updates, and recovery attempts will generate real audit logs automatically.
            </p>
          </Card>
        ) : result && rows.length > 0 ? (
          <DataTable
            columns={[
              { key: "timestamp", label: "Timestamp" },
              { key: "entityType", label: "Entity" },
              { key: "action", label: "Action" },
              { key: "entityId", label: "Entity ID" },
              { key: "actor", label: "Actor" },
              { key: "details", label: "Metadata" },
            ]}
            rows={rows}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
