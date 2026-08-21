"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import type { AnalyticsPoint } from "@/lib/mock-data/types";

interface RevenueTrendChartProps {
  data: AnalyticsPoint[];
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  return (
    <Card title="Revenue Recovery Trend" className="h-[320px]">
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 18, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#D7A455" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#D7A455" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="recoveredFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#4AB58D" stopOpacity={0.24} />
                <stop offset="95%" stopColor="#4AB58D" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" stroke="#A69D90" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#A69D90" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
            <Tooltip
              formatter={(value) => {
                const numeric = Array.isArray(value) ? Number(value[0]) : Number(value ?? 0);
                return [`₹${numeric.toLocaleString("en-IN")}`, ""] as [string, string];
              }}
              contentStyle={{ background: "#171613", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
            />
            <Area type="monotone" dataKey="revenueAtRisk" stroke="#D7A455" fill="url(#riskFill)" strokeWidth={2} />
            <Area type="monotone" dataKey="recovered" stroke="#4AB58D" fill="url(#recoveredFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
