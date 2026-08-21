import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils";

interface RecoveryActivityItem {
  transactionId: string;
  amount: number;
  problem: string;
  recommendation: string;
  confidence: number;
  policy: string;
  status: string;
}

interface RecoveryActivityProps {
  items: RecoveryActivityItem[];
}

export function RecoveryActivity({ items }: RecoveryActivityProps) {
  return (
    <Card title="AI Recovery Activity" className="p-0">
      <div className="overflow-x-auto rounded-xl">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[1.2fr_0.9fr_1.1fr_1fr_0.7fr_0.8fr_0.8fr] gap-3 border-b border-white/10 bg-[#171613] px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-[#B7AEA2]">
            <span>Transaction</span>
            <span>Amount</span>
            <span>Problem</span>
            <span>AI recommendation</span>
            <span>Confidence</span>
            <span>Policy</span>
            <span>Status</span>
          </div>
          <div>
            {items.map((item) => (
              <div key={item.transactionId} className="grid grid-cols-[1.2fr_0.9fr_1.1fr_1fr_0.7fr_0.8fr_0.8fr] gap-3 border-b border-white/5 px-4 py-3 text-sm last:border-none">
                <span className="font-medium text-[#F5F0E6]">{item.transactionId}</span>
                <span>{formatCurrency(item.amount)}</span>
                <span className="text-[#B7AEA2]">{item.problem}</span>
                <span>{item.recommendation}</span>
                <span>{item.confidence}%</span>
                <span>{item.policy}</span>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
