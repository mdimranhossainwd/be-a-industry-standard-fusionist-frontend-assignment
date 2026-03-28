// import { cn } from "@/lib/utils";
// import { AdminDashboardStats } from "@/types/api.types";

// interface AdminStatsGridProps {
//   stats: AdminDashboardStats;
// }

// export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
//   const items = [
//     {
//       label: "Total members",
//       value: stats.userCount,
//       sub: `${stats.activeUserCount} active · ${stats.inactiveUserCount} inactive`,
//       accent: "bg-blue-50 dark:bg-blue-950/30",
//       valueClass: undefined as string | undefined,
//       icon: (
//         <svg
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="text-blue-600 dark:text-blue-400"
//         >
//           <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//           <circle cx="9" cy="7" r="4" />
//           <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
//         </svg>
//       ),
//     },
//     {
//       label: "Total ideas",
//       value: stats.ideaCount,
//       sub: `${stats.pieChartData.find((p) => p.status === "APPROVED")?.count ?? 0} approved`,
//       accent: "bg-purple-50 dark:bg-purple-950/30",
//       valueClass: undefined as string | undefined,
//       icon: (
//         <svg
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="text-purple-600 dark:text-purple-400"
//         >
//           <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
//           <path d="M9 21h6" />
//         </svg>
//       ),
//     },
//     {
//       label: "Pending review",
//       value: stats.recentActivities.pendingIdeas.length,
//       sub: "needs your action",
//       accent:
//         stats.recentActivities.pendingIdeas.length > 0
//           ? "bg-yellow-50 dark:bg-yellow-950/30"
//           : "bg-muted/40",
//       valueClass:
//         stats.recentActivities.pendingIdeas.length > 0
//           ? "text-yellow-600 dark:text-yellow-400"
//           : undefined,
//       icon: (
//         <svg
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className={
//             stats.recentActivities.pendingIdeas.length > 0
//               ? "text-yellow-600 dark:text-yellow-400"
//               : "text-muted-foreground"
//           }
//         >
//           <circle cx="12" cy="12" r="10" />
//           <polyline points="12 6 12 12 16 14" />
//         </svg>
//       ),
//     },
//     {
//       label: "Total revenue",
//       value:
//         stats.totalRevenue > 0
//           ? `৳${stats.totalRevenue.toLocaleString()}`
//           : "৳0",
//       sub: `${stats.totalTransactions} transactions`,
//       accent: "bg-green-50 dark:bg-green-950/30",
//       valueClass: "text-green-600 dark:text-green-400",
//       icon: (
//         <svg
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="text-green-600 dark:text-green-400"
//         >
//           <line x1="12" y1="1" x2="12" y2="23" />
//           <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//       {items.map((item) => (
//         <div
//           key={item.label}
//           className={cn(
//             "rounded-xl border border-border/50 p-4 flex flex-col gap-3",
//             item.accent,
//           )}
//         >
//           <div className="flex items-center justify-between">
//             <p className="text-xs font-medium text-muted-foreground">
//               {item.label}
//             </p>
//             {item.icon}
//           </div>
//           <div>
//             <p
//               className={cn(
//                 "text-2xl font-semibold tracking-tight",
//                 item.valueClass,
//               )}
//             >
//               {item.value}
//             </p>
//             <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

import { cn } from "@/lib/utils";
import { AdminDashboardStats } from "@/types/api.types";
import { Clock, Lightbulb, TrendingUp, Users } from "lucide-react";

interface AdminStatsGridProps {
  stats: AdminDashboardStats;
}

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  const items = [
    {
      label: "Total members",
      value: stats.userCount,
      sub: `${stats.activeUserCount} active · ${stats.inactiveUserCount} inactive`,
      accent:
        "from-blue-50/80 to-blue-100/40 dark:from-blue-950/40 dark:to-blue-900/20",
      border: "border-blue-200/60 dark:border-blue-800/40",
      iconBg: "bg-blue-500/10 dark:bg-blue-400/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueClass: "text-foreground",
      icon: Users,
    },
    {
      label: "Total ideas",
      value: stats.ideaCount,
      sub: `${stats.pieChartData.find((p) => p.status === "APPROVED")?.count ?? 0} approved`,
      accent:
        "from-violet-50/80 to-violet-100/40 dark:from-violet-950/40 dark:to-violet-900/20",
      border: "border-violet-200/60 dark:border-violet-800/40",
      iconBg: "bg-violet-500/10 dark:bg-violet-400/10",
      iconColor: "text-violet-600 dark:text-violet-400",
      valueClass: "text-foreground",
      icon: Lightbulb,
    },
    {
      label: "Pending review",
      value: stats.recentActivities.pendingIdeas.length,
      sub: "awaiting your action",
      accent:
        stats.recentActivities.pendingIdeas.length > 0
          ? "from-amber-50/80 to-amber-100/40 dark:from-amber-950/40 dark:to-amber-900/20"
          : "from-muted/30 to-muted/10",
      border:
        stats.recentActivities.pendingIdeas.length > 0
          ? "border-amber-200/60 dark:border-amber-800/40"
          : "border-border/50",
      iconBg:
        stats.recentActivities.pendingIdeas.length > 0
          ? "bg-amber-500/10 dark:bg-amber-400/10"
          : "bg-muted/50",
      iconColor:
        stats.recentActivities.pendingIdeas.length > 0
          ? "text-amber-600 dark:text-amber-400"
          : "text-muted-foreground",
      valueClass:
        stats.recentActivities.pendingIdeas.length > 0
          ? "text-amber-600 dark:text-amber-400"
          : "text-foreground",
      icon: Clock,
    },
    {
      label: "Total revenue",
      value:
        stats.totalRevenue > 0
          ? `৳${stats.totalRevenue.toLocaleString()}`
          : "৳0",
      sub: `${stats.totalTransactions} transactions`,
      accent:
        "from-emerald-50/80 to-emerald-100/40 dark:from-emerald-950/40 dark:to-emerald-900/20",
      border: "border-emerald-200/60 dark:border-emerald-800/40",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-400/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      valueClass: "text-emerald-600 dark:text-emerald-400",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className={cn(
              "relative rounded-xl border bg-gradient-to-br p-4 flex flex-col gap-3 overflow-hidden transition-all duration-200 hover:shadow-sm",
              item.accent,
              item.border,
            )}
          >
            {/* subtle top-right glow */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20 blur-xl bg-current pointer-events-none" />

            <div className="flex items-center justify-between">
              <p className="text-[12px] font-medium text-muted-foreground tracking-wide uppercase">
                {item.label}
              </p>
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  item.iconBg,
                )}
              >
                <Icon
                  className={cn("w-4 h-4", item.iconColor)}
                  strokeWidth={1.8}
                />
              </div>
            </div>
            <div>
              <p
                className={cn(
                  "text-[26px] font-bold tracking-tight leading-none",
                  item.valueClass,
                )}
              >
                {item.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
                {item.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
