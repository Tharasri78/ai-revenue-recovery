import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { RecoveryCase } from "@/lib/mock-data/types";
import { formatCurrency } from "@/lib/utils";

interface RecoveryCaseCardProps {
  caseItem: RecoveryCase;
}

export function RecoveryCaseCard({ caseItem }: RecoveryCaseCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-[#B7AEA2]">{caseItem.transactionId}</div>
          <div className="mt-1 text-xl font-semibold text-[#F5F0E6]">{formatCurrency(caseItem.amount)} payment failed</div>
        </div>
        <StatusBadge status={caseItem.status} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#B7AEA2]">Recovery probability</p>
          <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">{caseItem.recoveryProbability}%</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#B7AEA2]">Expected recovery</p>
          <p className="mt-2 text-2xl font-semibold text-[#F5F0E6]">{formatCurrency(caseItem.expectedRecoveryValue)}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-[#B7AEA2]">AI recommendation: </span>
          <span className="font-medium text-[#F5F0E6]">{caseItem.recommendedAction}</span>
        </div>
        <div>
          <span className="text-[#B7AEA2]">Reason: </span>
          <span className="text-[#F5F0E6]">{caseItem.reason}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B7AEA2]">Policy:</span>
          <Badge tone={caseItem.policyResult === "Approved" ? "green" : caseItem.policyResult === "Needs review" ? "amber" : "red"}>{caseItem.policyResult}</Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Link href={`/transactions/${caseItem.transactionId}`}>
          <Button variant="secondary" size="sm">Review</Button>
        </Link>
        <Button variant="primary" size="sm">Approve</Button>
        <Button variant="ghost" size="sm">Reject</Button>
      </div>
    </Card>
  );
}
