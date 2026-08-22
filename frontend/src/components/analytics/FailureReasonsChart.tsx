"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";

interface FailureReasonsChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ["#D7A455", "#E26B5B", "#4AB58D", "#7C9CF2", "#B7AEA2"];

export function FailureReasonsChart({ data }: FailureReasonsChartProps) {
  return (
    <Card title="Recovery by failure reason" className="h-[280px]">
      <div className="h-[220px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#B7AEA2]">
            No failure reason data available yet
          </div>
        ) : (
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#A69D90" fontSize={10} />
              <YAxis tickLine={false} axisLine={false} stroke="#A69D90" fontSize={11} />
              <Tooltip
                formatter={(value) => {
                  const numeric = Array.isArray(value) ? Number(value[0]) : Number(value ?? 0);
                  return [`${numeric}%`, "Share of failures"] as [string, string];
                }}
                contentStyle={{ background: "#171613", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
