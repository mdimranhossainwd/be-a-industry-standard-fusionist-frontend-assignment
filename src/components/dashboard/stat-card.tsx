import { cn } from "@/lib/utils";
import { MemberDashboardStats } from "@/types/api.types";
import {} from "@/types/dashboard.types";

interface StatItem {
  label: string;
  value: string | number;
  sub: string;
  valueClass?: string;
  icon: React.ReactNode;
}

interface StatsGridProps {
  stats: MemberDashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const items: StatItem[] = [
    {
      label: "Total ideas",
      value: stats.myIdeaCount,
      sub: "all time",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
          <path d="M9 21h6M10 17v-1M14 17v-1" />
        </svg>
      ),
    },
    {
      label: "Upvotes received",
      value: stats.upvotesReceived,
      sub: `${stats.downvotesReceived} downvotes`,
      valueClass: "text-green-600 dark:text-green-400",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
      ),
    },
    {
      label: "Comments received",
      value: stats.commentsReceived,
      sub: `${stats.commentsMade} comments made`,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      label: "Total spent",
      value: stats.totalSpent > 0 ? `৳${stats.totalSpent}` : "৳0",
      sub: `${stats.purchasedIdeasCount} ideas purchased`,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 6v2m0 8v2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl bg-muted/40 border border-border/50 p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              {item.label}
            </p>
            <span className="text-muted-foreground/60">{item.icon}</span>
          </div>
          <div>
            <p
              className={cn(
                "text-2xl font-semibold tracking-tight",
                item.valueClass,
              )}
            >
              {item.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
