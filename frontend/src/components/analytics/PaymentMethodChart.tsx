"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";

interface PaymentMethodChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ["#D7A455", "#4AB58D", "#7C9CF2", "#E26B5B", "#B7AEA2"];

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  return (
    <Card title="Recovery by payment method" className="h-[280px]">
      <div className="flex h-[220px] w-full items-center">
        {data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#B7AEA2]">
            No payment method data available yet
          </div>
        ) : (
          <>
            <div className="h-full w-[160px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Share"]}
                    contentStyle={{ background: "#171613", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-4 flex flex-col gap-2">
              {data.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-[#D5CFC4]">
                  <span
                    className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="capitalize">{entry.name.toLowerCase()}</span>
                  <span className="ml-auto pl-4 font-medium text-[#F5F0E6]">{entry.value}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
