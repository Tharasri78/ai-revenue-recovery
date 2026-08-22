"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ApiRecoveryCase } from "@/types/backend";
import { formatCurrency } from "@/lib/utils";
import { updateRecoveryCase } from "@/services/recovery";

interface RecoveryCaseCardProps {
  caseItem: ApiRecoveryCase;
  onUpdated?: () => void;
}

export function RecoveryCaseCard({ caseItem, onUpdated }: RecoveryCaseCardProps) {
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<"APPROVED" | "REJECTED" | null>(null);

  async function updateStatus(status: "APPROVED" | "REJECTED") {
    setError("");
    setUpdatingStatus(status);
    try {
      await updateRecoveryCase(caseItem.id, { status });
      onUpdated?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update recovery case.");
    } finally {
      setUpdatingStatus(null);
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-[#B7AEA2]">{caseItem.transactionId}</div>
          <div className="mt-1 text-xl font-semibold text-[#F5F0E6]">{formatCurrency(Number(caseItem.transaction?.amount ?? 0))} payment failed</div>
        </div>
        <StatusBadge status={caseItem.status} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#B7AEA2]">Recovery probability</p>
          <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">{caseItem.recoveryScore === null ? "-" : `${Number(caseItem.recoveryScore) * 100}%`}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#B7AEA2]">Expected recovery</p>
          <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">{caseItem.recoverableAmount === null ? "-" : formatCurrency(Number(caseItem.recoverableAmount))}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-[#B7AEA2]">AI recommendation: </span>
          <span className="font-medium text-[#F5F0E6]">{caseItem.selectedAction?.replaceAll("_", " ") ?? "No recommendation"}</span>
        </div>
        <div>
          <span className="text-[#B7AEA2]">Reason: </span>
          <span className="text-[#F5F0E6]">{caseItem.recommendationReason ?? "No recommendation reason available."}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B7AEA2]">Policy:</span>
          <Badge tone={caseItem.outcome === "SUCCESS" ? "green" : caseItem.status === "FAILED" ? "red" : "amber"}>{caseItem.status.replaceAll("_", " ")}</Badge>
        </div>
      </div>

      {error ? <div className="rounded-md border border-[#E26B5B]/30 bg-[#E26B5B]/10 px-3 py-2 text-sm text-[#F7B0A5]">{error}</div> : null}

      <div className="flex flex-wrap gap-2 pt-2">
        <Link href={`/recovery/${caseItem.id}`}>
          <Button variant="secondary" size="sm">Open case</Button>
        </Link>
        <Button variant="primary" size="sm" disabled={updatingStatus !== null} onClick={() => updateStatus("APPROVED")}>{updatingStatus === "APPROVED" ? "Approving..." : "Approve"}</Button>
        <Button variant="ghost" size="sm" disabled={updatingStatus !== null} onClick={() => updateStatus("REJECTED")}>{updatingStatus === "REJECTED" ? "Rejecting..." : "Reject"}</Button>
      </div>
    </Card>
  );
}
