import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { InsightMetric } from "@/lib/mock-data/types";

interface KPIGridProps {
  items: InsightMetric[];
}

export function KPIGrid({ items }: KPIGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className={cn("min-h-[160px] p-5") }>
          <p className="text-sm text-[#B7AEA2]">{item.label}</p>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="text-3xl font-semibold tracking-tight text-[#F5F0E6]">{item.value}</div>
            <div className="rounded-full border border-[#D7A455]/20 bg-[#D7A455]/10 px-2 py-1 text-[10px] font-medium text-[#F3C77F]">
              {item.delta}
            </div>
          </div>
          <p className="mt-4 text-sm text-[#B7AEA2]">{item.description}</p>
        </Card>
      ))}
    </div>
  );
}
