// "use client";

// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import { ADMIN_STATUS_CONFIG, AdminDashboardStats } from "@/types/api.types";

// // ─── Donut tooltip ────────────────────────────────────────────────────────────

// function PieTooltip({
//   active,
//   payload,
// }: {
//   active?: boolean;
//   payload?: { name: string; value: number; payload: { pct: number } }[];
// }) {
//   if (!active || !payload?.length) return null;
//   const item = payload[0];
//   return (
//     <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-sm">
//       <p className="font-medium text-foreground">{item.name}</p>
//       <p className="text-muted-foreground mt-0.5">
//         {item.value} ideas &nbsp;·&nbsp; {item.payload.pct}%
//       </p>
//     </div>
//   );
// }

// // ─── Status bar tooltip ───────────────────────────────────────────────────────

// function StatusBarTooltip({
//   active,
//   payload,
//   label,
// }: {
//   active?: boolean;
//   payload?: { value: number; fill: string }[];
//   label?: string;
// }) {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="rounded-lg border bg-card px-3 py-2 text-xs shadow-sm space-y-0.5">
//       <p className="font-medium text-foreground mb-1">{label}</p>
//       <p className="text-muted-foreground">
//         {payload[0].value} idea{payload[0].value !== 1 ? "s" : ""}
//       </p>
//     </div>
//   );
// }

// // ─── Custom bar label ─────────────────────────────────────────────────────────

// function CustomBarLabel({
//   x,
//   y,
//   width,
//   value,
// }: {
//   x?: number;
//   y?: number;
//   width?: number;
//   value?: number;
// }) {
//   if (!value || value === 0) return null;
//   return (
//     <text
//       x={(x ?? 0) + (width ?? 0) / 2}
//       y={(y ?? 0) - 4}
//       fill="var(--color-text-secondary, #888)"
//       fontSize={11}
//       textAnchor="middle"
//     >
//       {value}
//     </text>
//   );
// }

// // ─── All statuses — ensure all 4 always shown even if count = 0 ───────────────

// const ALL_STATUSES = [
//   "DRAFT",
//   "UNDER_REVIEW",
//   "APPROVED",
//   "REJECTED",
// ] as const;

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface AdminChartsProps {
//   stats: AdminDashboardStats;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export function AdminCharts({ stats }: AdminChartsProps) {
//   const total = stats.pieChartData.reduce((acc, e) => acc + e.count, 0);

//   // Donut data
//   const pieData = stats.pieChartData.map((entry) => ({
//     status: entry.status,
//     name: ADMIN_STATUS_CONFIG[entry.status]?.label ?? entry.status,
//     value: entry.count,
//     pct: total > 0 ? Math.round((entry.count / total) * 100) : 0,
//   }));

//   // Bar data — always show all 4 statuses, fill 0 if missing
//   const barData = ALL_STATUSES.map((status) => {
//     const found = stats.pieChartData.find((e) => e.status === status);
//     return {
//       status,
//       name: ADMIN_STATUS_CONFIG[status]?.label ?? status,
//       count: found?.count ?? 0,
//       color: ADMIN_STATUS_CONFIG[status]?.color ?? "#888780",
//     };
//   });

//   return (
//     <div className="grid gap-4 lg:grid-cols-2">

//       {/* ── Donut: ideas by status ──────────────────────────────────────── */}
//       <div className="rounded-xl border bg-card p-5 space-y-4">
//         <div className="flex items-center justify-between">
//           <h3 className="text-sm font-medium">Ideas by status</h3>
//           <span className="text-xs text-muted-foreground">{total} total</span>
//         </div>

//         {total === 0 ? (
//           <div className="py-10 text-center">
//             <p className="text-sm text-muted-foreground">No ideas yet</p>
//           </div>
//         ) : (
//           <div className="flex items-center gap-4">
//             <div className="w-[140px] h-[140px] shrink-0">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={42}
//                     outerRadius={62}
//                     paddingAngle={3}
//                     dataKey="value"
//                     strokeWidth={0}
//                   >
//                     {pieData.map((entry) => (
//                       <Cell
//                         key={entry.status}
//                         fill={
//                           ADMIN_STATUS_CONFIG[
//                             entry.status as keyof typeof ADMIN_STATUS_CONFIG
//                           ]?.color ?? "#888780"
//                         }
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<PieTooltip />} />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="flex flex-col gap-2.5 flex-1">
//               {pieData.map((entry) => {
//                 const cfg =
//                   ADMIN_STATUS_CONFIG[
//                     entry.status as keyof typeof ADMIN_STATUS_CONFIG
//                   ];
//                 return (
//                   <div key={entry.status} className="flex items-center gap-2">
//                     <span
//                       className="w-2.5 h-2.5 rounded-full shrink-0"
//                       style={{ background: cfg?.color }}
//                     />
//                     <span className="text-xs text-muted-foreground flex-1">
//                       {cfg?.label}
//                     </span>
//                     <span className="text-xs font-medium tabular-nums">
//                       {entry.value}
//                     </span>
//                     <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
//                       {entry.pct}%
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ── Bar: all status counts ──────────────────────────────────────── */}
//       <div className="rounded-xl border bg-card p-5 space-y-4">
//         <div className="flex items-center justify-between">
//           <h3 className="text-sm font-medium">Ideas count by status</h3>
//           <span className="text-xs text-muted-foreground">{total} total</span>
//         </div>

//         <div className="h-[180px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={barData}
//               margin={{ top: 20, right: 4, left: -20, bottom: 0 }}
//               barSize={40}
//             >
//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="hsl(var(--border))"
//                 vertical={false}
//               />
//               <XAxis
//                 dataKey="name"
//                 tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
//                 axisLine={false}
//                 tickLine={false}
//                 interval={0}
//               />
//               <YAxis
//                 tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
//                 axisLine={false}
//                 tickLine={false}
//                 allowDecimals={false}
//               />
//               <Tooltip
//                 content={<StatusBarTooltip />}
//                 cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
//               />
//               <Bar
//                 dataKey="count"
//                 radius={[6, 6, 0, 0]}
//                 label={<CustomBarLabel />}
//               >
//                 {barData.map((entry) => (
//                   <Cell key={entry.status} fill={entry.color} />
//                 ))}
//               </Bar>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Summary row */}
//         <div className="flex items-center justify-between pt-1 border-t border-border/50">
//           {barData.map((entry) => (
//             <div key={entry.status} className="flex flex-col items-center gap-1">
//               <span
//                 className="w-2 h-2 rounded-full"
//                 style={{ background: entry.color }}
//               />
//               <span className="text-xs font-semibold tabular-nums">
//                 {entry.count}
//               </span>
//               <span className="text-[10px] text-muted-foreground leading-tight text-center">
//                 {entry.name.split(" ")[0]}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//     </div>
//   );
// }

"use client";

import { ADMIN_STATUS_CONFIG, AdminDashboardStats } from "@/types/api.types";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Donut tooltip ────────────────────────────────────────────────────────────

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { pct: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border bg-card/95 backdrop-blur-sm px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-foreground">{item.name}</p>
      <p className="text-muted-foreground mt-0.5">
        {item.value} ideas · {item.payload.pct}%
      </p>
    </div>
  );
}

// ─── Area chart tooltip ───────────────────────────────────────────────────────

function AreaTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card/95 backdrop-blur-sm px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-emerald-600 dark:text-emerald-400 font-medium">
        ৳{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

// ─── All statuses ─────────────────────────────────────────────────────────────

const ALL_STATUSES = ["DRAFT", "UNDER_REVIEW", "APPROVED", "REJECTED"] as const;

interface AdminChartsProps {
  stats: AdminDashboardStats;
}

export function AdminCharts({ stats }: AdminChartsProps) {
  const total = stats.pieChartData.reduce((acc, e) => acc + e.count, 0);

  // Donut data
  const pieData = stats.pieChartData.map((entry) => ({
    status: entry.status,
    name: ADMIN_STATUS_CONFIG[entry.status]?.label ?? entry.status,
    value: entry.count,
    pct: total > 0 ? Math.round((entry.count / total) * 100) : 0,
  }));

  // Payment transactions area chart data
  // Use real transactionChartData if available, else generate month buckets from totalRevenue
  const transactionData: { month: string; revenue: number; count: number }[] =
    stats?.transactionChartData ??
    (() => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const now = new Date();
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return {
          month: months[d.getMonth()],
          revenue: 0,
          count: 0,
        };
      });
    })();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* ── Donut: ideas by status ──────────────────────────────────────── */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-semibold text-foreground">
              Ideas by status
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Distribution across all states
            </p>
          </div>
          <span className="text-[11px] font-medium bg-muted/60 px-2 py-1 rounded-md text-muted-foreground">
            {total} total
          </span>
        </div>

        {total === 0 ? (
          <div className="py-10 text-center">
            <p className="text-[13px] text-muted-foreground">No ideas yet</p>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            {/* Donut */}
            <div className="w-[130px] h-[130px] shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={58}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={
                          ADMIN_STATUS_CONFIG[
                            entry.status as keyof typeof ADMIN_STATUS_CONFIG
                          ]?.color ?? "#888780"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* center total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[18px] font-bold leading-none">
                  {total}
                </span>
                <span className="text-[9px] text-muted-foreground mt-0.5 uppercase tracking-wide">
                  ideas
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-2 flex-1">
              {ALL_STATUSES.map((status) => {
                const entry = pieData.find((p) => p.status === status);
                const cfg = ADMIN_STATUS_CONFIG[status];
                const count = entry?.value ?? 0;
                const pct = entry?.pct ?? 0;
                return (
                  <div key={status} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: cfg?.color }}
                    />
                    <span className="text-[12px] text-muted-foreground flex-1 leading-none">
                      {cfg?.label}
                    </span>
                    <span className="text-[12px] font-semibold tabular-nums">
                      {count}
                    </span>
                    <span className="text-[11px] text-muted-foreground tabular-nums w-7 text-right">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Area: payment transactions ──────────────────────────────────── */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-semibold text-foreground">
              Payment transactions
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Revenue over last 6 months
            </p>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
              ৳{stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {stats.totalTransactions} total txns
            </p>
          </div>
        </div>

        {stats.totalTransactions === 0 ? (
          <div className="py-10 text-center flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="text-emerald-500"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <p className="text-[12px] text-muted-foreground">
              No transactions yet
            </p>
          </div>
        ) : (
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={transactionData}
                margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tickFormatter={(v) => `৳${v}`}
                />
                <Tooltip content={<AreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  dot={{ fill: "#10b981", r: 3, strokeWidth: 0 }}
                  activeDot={{
                    r: 5,
                    fill: "#10b981",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Transaction count summary */}
        {stats.totalTransactions > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-muted-foreground">
                Revenue trend
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              avg ৳
              {stats.totalTransactions > 0
                ? Math.round(
                    stats.totalRevenue / stats.totalTransactions,
                  ).toLocaleString()
                : 0}{" "}
              / txn
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
