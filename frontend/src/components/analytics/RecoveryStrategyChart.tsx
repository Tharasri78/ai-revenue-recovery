"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";

interface RecoveryStrategyChartProps {
  data: Array<{ strategy: string; value: number }>;
}

export function RecoveryStrategyChart({ data }: RecoveryStrategyChartProps) {
  return (
    <Card title="Recovery by strategy" className="h-[280px]">
      <div className="h-[220px] w-full">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="strategy" tickLine={false} axisLine={false} stroke="#A69D90" fontSize={11} />
            <YAxis tickLine={false} axisLine={false} stroke="#A69D90" fontSize={11} />
            <Tooltip
              formatter={(value) => {
                const numeric = Array.isArray(value) ? Number(value[0]) : Number(value ?? 0);
                return [`${numeric}%`, "Recovered"] as [string, string];
              }}
              contentStyle={{ background: "#171613", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
            />
            <Bar dataKey="value" fill="#D7A455" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
