"use client";

import { MemberDashboardStats } from "@/types/api.types";
import { STATUS_CONFIG } from "@/types/dashboard.types";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// ─── Color map matching STATUS_CONFIG ─────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#888780",
  UNDER_REVIEW: "#EF9F27",
  APPROVED: "#1D9E75",
  REJECTED: "#E24B4A",
};

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { pct: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-sm">
      <p className="font-medium text-foreground">{item.name}</p>
      <p className="text-muted-foreground mt-0.5">
        {item.value} ideas &nbsp;·&nbsp; {item.payload.pct}%
      </p>
    </div>
  );
}

// ─── Custom legend ────────────────────────────────────────────────────────────

function CustomLegend({
  data,
}: {
  data: { status: string; count: number; pct: number }[];
}) {
  return (
    <div className="flex flex-col gap-2 justify-center">
      {data.map((entry) => {
        const cfg = STATUS_CONFIG[entry.status as keyof typeof STATUS_CONFIG];
        return (
          <div key={entry.status} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: STATUS_COLORS[entry.status] }}
            />
            <span className="text-xs text-muted-foreground flex-1">
              {cfg?.label}
            </span>
            <span className="text-xs font-medium tabular-nums">
              {entry.count}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
              {entry.pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface StatusBreakdownChartProps {
  stats: MemberDashboardStats;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StatusBreakdownChart({ stats }: StatusBreakdownChartProps) {
  const total = stats.pieChartData.reduce((acc, e) => acc + e.count, 0);

  const chartData = stats.pieChartData.map((entry) => ({
    status: entry.status,
    name:
      STATUS_CONFIG[entry.status as keyof typeof STATUS_CONFIG]?.label ??
      entry.status,
    value: entry.count,
    pct: total > 0 ? Math.round((entry.count / total) * 100) : 0,
  }));

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Idea status breakdown</h3>
        <span className="text-xs text-muted-foreground">{total} total</span>
      </div>

      {total === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-muted-foreground">No ideas yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Create your first idea to see the chart
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* Donut chart */}
          <div className="w-[140px] h-[140px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={62}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? "#888780"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center label overlay — total count */}
          <div className="flex-1">
            <CustomLegend data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
}
