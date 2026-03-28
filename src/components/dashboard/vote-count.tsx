import { MemberDashboardStats } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";

interface VotesCountCardProps {
  stats: MemberDashboardStats;
}

export function VotesCountCard({ stats }: VotesCountCardProps) {
  const total = stats.upvotesReceived + stats.downvotesReceived;
  const upPct =
    total > 0 ? Math.round((stats.upvotesReceived / total) * 100) : 0;
  const downPct = total > 0 ? 100 - upPct : 0;

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Votes received</h3>
        <span className="text-xs text-muted-foreground">{total} total</span>
      </div>

      {total === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-muted-foreground">No votes yet</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Submit an idea and get the community voting
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {/* Big numbers row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="text-green-600 dark:text-green-400"
                >
                  <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
                <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                  Upvotes
                </span>
              </div>
              <p className="text-2xl font-semibold text-green-700 dark:text-green-400 tabular-nums">
                {stats.upvotesReceived}
              </p>
              <p className="text-xs text-green-600/70 dark:text-green-500">
                {upPct}% of total
              </p>
            </div>

            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="text-red-500 dark:text-red-400"
                >
                  <path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
                </svg>
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Downvotes
                </span>
              </div>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400 tabular-nums">
                {stats.downvotesReceived}
              </p>
              <p className="text-xs text-red-500/70 dark:text-red-500">
                {downPct}% of total
              </p>
            </div>
          </div>

          {/* Approval bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Approval rate</span>
              <span className="font-medium text-foreground">{upPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
              <div
                className="h-full bg-green-500 transition-all duration-500 rounded-l-full"
                style={{ width: `${upPct}%` }}
              />
              <div
                className={cn(
                  "h-full bg-red-400 transition-all duration-500",
                  downPct === 100 ? "rounded-full" : "rounded-r-full"
                )}
                style={{ width: `${downPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">
                ▲ {stats.upvotesReceived} up
              </span>
              <span className="text-red-500 dark:text-red-400">
                ▼ {stats.downvotesReceived} down
              </span>
            </div>
          </div>

          {/* Comments row */}
          <div className="flex items-center justify-between pt-1 border-t border-border/50">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <svg
                width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Comments received
            </div>
            <span className="text-sm font-medium tabular-nums">
              {stats.commentsReceived}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}