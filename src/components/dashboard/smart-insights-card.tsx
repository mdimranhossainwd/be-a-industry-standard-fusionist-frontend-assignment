"use client";

import { cn } from "@/lib/utils";
import { generateInsights, InsightSeverity } from "@/lib/ai/insights-engine";
import { MemberDashboardStats } from "@/types/api.types";
import { Sparkles, RefreshCw } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SmartInsightsCardProps {
  stats: MemberDashboardStats;
}

// Map severity → Tailwind colours (border-left accent + badge)
const SEVERITY_STYLES: Record<
  InsightSeverity,
  { border: string; badge: string; dot: string }
> = {
  positive: {
    border: "border-l-emerald-500 dark:border-l-emerald-400",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  neutral: {
    border: "border-l-sky-500 dark:border-l-sky-400",
    badge: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  warning: {
    border: "border-l-amber-500 dark:border-l-amber-400",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  info: {
    border: "border-l-violet-500 dark:border-l-violet-400",
    badge:
      "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    dot: "bg-violet-500",
  },
};

const SEVERITY_LABEL: Record<InsightSeverity, string> = {
  positive: "Great",
  neutral: "Note",
  warning: "Action needed",
  info: "Info",
};

/** Circular SVG score ring */
function ScoreRing({ score, label }: { score: number; label: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const ringColor =
    score >= 80
      ? "#10b981" // emerald
      : score >= 60
        ? "#3b82f6" // blue
        : score >= 40
          ? "#f59e0b" // amber
          : "#6b7280"; // gray

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 84 84">
          {/* Track */}
          <circle
            cx="42"
            cy="42"
            r={radius}
            fill="none"
            strokeWidth="7"
            className="stroke-border/50"
          />
          {/* Progress */}
          <circle
            cx="42"
            cy="42"
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold leading-none">{score}</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wide">
            / 100
          </span>
        </div>
      </div>
      <span
        className="text-xs font-semibold"
        style={{ color: ringColor }}
      >
        {label}
      </span>
    </div>
  );
}

export function SmartInsightsCard({ stats }: SmartInsightsCardProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // useMemo with refreshKey as dependency so "refresh" re-runs the engine
  const report = useMemo(
    () => generateInsights(stats),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stats, refreshKey]
  );

  const timeLabel = mounted
    ? report.generatedAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-none">
              AI Smart Insights
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {mounted ? `Updated at ${timeLabel}` : "Analyzing statistics..."}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
          aria-label="Refresh insights"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="flex gap-4 items-start">
        {/* Score ring */}
        <ScoreRing
          score={report.performanceScore}
          label={report.performanceLabel}
        />

        {/* Insights list */}
        <div className="flex-1 space-y-2.5 min-w-0">
          {report.insights.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No insights available yet — submit your first idea!
            </p>
          ) : (
            report.insights.map((insight) => {
              const styles = SEVERITY_STYLES[insight.severity];
              return (
                <div
                  key={insight.id}
                  className={cn(
                    "rounded-lg border-l-4 bg-background px-3 py-2.5 space-y-0.5 shadow-sm",
                    styles.border
                  )}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        styles.badge
                      )}
                    >
                      <span
                        className={cn("h-1.5 w-1.5 rounded-full", styles.dot)}
                      />
                      {SEVERITY_LABEL[insight.severity]}
                    </span>
                    <p className="text-xs font-medium leading-snug">
                      {insight.emoji}&nbsp;{insight.headline}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-0.5">
                    {insight.detail}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Footer note ────────────────────────────────────────────────── */}
      <p className="text-[10px] text-muted-foreground/60 border-t pt-2">
        Insights are generated client-side based on your live dashboard data.
      </p>
    </div>
  );
}
