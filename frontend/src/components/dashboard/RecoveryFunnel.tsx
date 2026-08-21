import { Card } from "@/components/ui/Card";
import { cn, formatCompactCurrency } from "@/lib/utils";
import type { FunnelPoint } from "@/lib/mock-data/types";

interface RecoveryFunnelProps {
  items: FunnelPoint[];
}

export function RecoveryFunnel({ items }: RecoveryFunnelProps) {
  const maxValue = Math.max(...items.map((item) => item.value));

  return (
    <Card title="Revenue Recovery Funnel" className="p-5">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-[#B7AEA2]">{item.label}</span>
              <span className="font-medium text-[#F5F0E6]">{formatCompactCurrency(item.value)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#171613]">
              <div
                className={cn(
                  "h-full rounded-full",
                  index === 0 ? "bg-[#D7A455]" : index === 1 ? "bg-[#E0B95B]" : index === 2 ? "bg-[#D7A455]/80" : "bg-[#4AB58D]",
                )}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
