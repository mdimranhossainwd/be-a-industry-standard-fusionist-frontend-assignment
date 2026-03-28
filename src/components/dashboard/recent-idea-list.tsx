import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MemberDashboardStats } from "@/types/api.types";
import { STATUS_CONFIG } from "@/types/dashboard.types";
import { format } from "date-fns";
import Link from "next/link";

interface RecentIdeasListProps {
  stats: MemberDashboardStats;
}

export function RecentIdeasList({ stats }: RecentIdeasListProps) {
  const ideas = stats.recentIdeas;

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent ideas</h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
          <Link href="/dashboard/my-ideas">View all</Link>
        </Button>
      </div>

      {ideas.length === 0 ? (
        <div className="py-8 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            You haven&apos;t created any ideas yet
          </p>
          <Button size="sm" asChild>
            <Link href="/dashboard/create-idea">+ Create your first idea</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {ideas.map((idea) => {
            const cfg = STATUS_CONFIG[idea.status];
            return (
              <div
                key={idea.id}
                className="py-3 flex items-start justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium line-clamp-1 leading-snug">
                    {idea.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                      {idea.category.name}
                    </span>
                    <span className="text-muted-foreground/40 text-xs">·</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(idea.createdAt), "dd MMM yyyy")}
                    </span>
                    <span className="text-muted-foreground/40 text-xs">·</span>
                    <span className="text-xs text-muted-foreground">
                      ▲ {idea._count.votes}
                    </span>
                  </div>
                  {/* Rejection feedback inline */}
                  {idea.rejectionFeedback && (
                    <p className="text-xs text-destructive mt-1 line-clamp-1">
                      Feedback: {idea.rejectionFeedback}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge className={cn("text-xs", cfg.badgeClass)}>
                    {cfg.label}
                  </Badge>
                  {idea.isPaid && (
                    <Badge
                      variant="outline"
                      className="text-xs text-purple-700 border-purple-300"
                    >
                      Paid
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
