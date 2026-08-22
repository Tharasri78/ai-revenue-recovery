"use client";

import { Card } from "@/components/ui/Card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RevenueAnalyticsProps {
  data: Array<{ label: string; revenueAtRisk: number; recovered: number }>;
}

export function RevenueAnalytics({ data }: RevenueAnalyticsProps) {
  return (
    <Card title="Revenue at risk vs recovered" className="h-[320px]">
      <div className="h-[260px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-[#B7AEA2]">
            No revenue trend data available yet
          </div>
        ) : (
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 18, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="riskArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#D7A455" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="#D7A455" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="recoverArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#4AB58D" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4AB58D" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" stroke="#A69D90" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} stroke="#A69D90" tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip
                formatter={(value) => {
                  const numeric = Array.isArray(value) ? Number(value[0]) : Number(value ?? 0);
                  return [`₹${numeric.toLocaleString("en-IN")}`, ""] as [string, string];
                }}
                contentStyle={{ background: "#171613", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
              />
              <Area type="monotone" dataKey="revenueAtRisk" stroke="#D7A455" fill="url(#riskArea)" strokeWidth={2} />
              <Area type="monotone" dataKey="recovered" stroke="#4AB58D" fill="url(#recoverArea)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
