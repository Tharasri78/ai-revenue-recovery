import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { getAuditEvents } from "@/services/audit";

export default async function AuditLogsPage() {
  const events = await getAuditEvents();

  const rows = events.map((event) => ({
    timestamp: new Date(event.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    transaction: event.transactionId,
    event: event.event,
    actor: event.actor,
    decision: event.aiDecision,
    policy: <Badge tone={event.policyResult === "Approved" ? "green" : event.policyResult === "Pending" ? "amber" : "red"}>{event.policyResult}</Badge>,
    action: event.action,
    outcome: <Badge tone={event.outcome === "Success" ? "green" : event.outcome === "Pending" ? "amber" : event.outcome === "Failed" ? "red" : "muted"}>{event.outcome}</Badge>,
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex flex-wrap gap-3">
            {['Transaction', 'Event', 'Date', 'Outcome'].map((filter) => (
              <button key={filter} className="rounded-md border border-white/10 bg-[#171613] px-3 py-2 text-xs uppercase tracking-[0.12em] text-[#B7AEA2]">
                {filter}
              </button>
            ))}
          </div>
        </Card>

        <DataTable
          columns={[
            { key: "timestamp", label: "Timestamp" },
            { key: "transaction", label: "Transaction" },
            { key: "event", label: "Event" },
            { key: "actor", label: "Actor" },
            { key: "decision", label: "AI decision" },
            { key: "policy", label: "Policy result" },
            { key: "action", label: "Action" },
            { key: "outcome", label: "Outcome" },
          ]}
          rows={rows}
        />
      </div>
    </AppShell>
  );
}
