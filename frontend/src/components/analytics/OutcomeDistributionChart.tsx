"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";

interface OutcomeDistributionChartProps {
  data: Array<{ label: string; value: number }>;
}

const OUTCOME_COLORS: Record<string, string> = {
  PENDING: "#D7A455",
  SUCCESS: "#4AB58D",
  FAILED: "#E26B5B",
  BLOCKED: "#B7AEA2",
  REJECTED: "#E89B4A",
  EXPIRED: "#7C9CF2",
};
const FALLBACK_COLORS = ["#D7A455", "#4AB58D", "#E26B5B", "#7C9CF2", "#B7AEA2", "#E89B4A"];

function formatAttemptCount(count: number) {
  return `${count} attempt${count !== 1 ? "s" : ""}`;
}

export function OutcomeDistributionChart({ data }: OutcomeDistributionChartProps) {
  const chartData = data.filter((entry) => entry.value > 0);
  const totalAttempts = chartData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card title="Recovery outcome distribution" className="h-[280px]">
      <div className="flex h-[220px] w-full items-center">
        {chartData.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-[#B7AEA2]">
            No recovery attempt data available yet
          </div>
        ) : (
          <>
            <div className="h-full w-[160px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={chartData.length > 1 ? 3 : 0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={OUTCOME_COLORS[entry.label] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      const count = Number(value);
                      const share = totalAttempts > 0 ? ((count / totalAttempts) * 100).toFixed(1) : "0.0";
                      return [`${formatAttemptCount(count)} (${share}%)`, String(name)] as [string, string];
                    }}
                    contentStyle={{ background: "#171613", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-4 flex flex-col gap-2">
              {chartData.map((entry, index) => (
                <div key={entry.label} className="flex items-center gap-2 text-xs text-[#D5CFC4]">
                  <span
                    className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: OUTCOME_COLORS[entry.label] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length] }}
                  />
                  <span>
                    {entry.label} ({formatAttemptCount(entry.value)})
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
