"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MemberDashboardStats } from "@/types/api.types";
import Link from "next/link";
import { RecentIdeasList } from "./recent-idea-list";
import { StatsGrid } from "./stat-card";
import { StatusBreakdownChart } from "./status-breakdown";
import { VotesCountCard } from "./vote-count";

interface User {
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

interface DashboardOverviewProps {
  user: User;
  initialStats: MemberDashboardStats | null;
}

function StatsSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </>
  );
}

export function DashboardOverview({
  user,
  initialStats,
}: DashboardOverviewProps) {
  const stats = initialStats;

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s an overview of your EcoSpark Hub activity
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/create-idea">+ New idea</Link>
        </Button>
      </div>

      {!stats ? (
        <StatsSkeleton />
      ) : (
        <>
          {/* ── Row 1: stat cards ──────────────────────────────────────── */}
          <StatsGrid stats={stats} />

          {/* ── Row 2: donut chart + votes card ───────────────────────── */}
          <div className="grid gap-4 lg:grid-cols-2">
            <StatusBreakdownChart stats={stats} />
            <VotesCountCard stats={stats} />
          </div>

          {/* ── Row 3: recent ideas (full width) ──────────────────────── */}
          <RecentIdeasList stats={stats} />
        </>
      )}

      {/* ── Quick actions ─────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <h3 className="text-sm font-medium">Quick actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Button variant="outline" className="w-full text-sm" asChild>
            <Link href="/dashboard/create-idea">Create idea</Link>
          </Button>
          <Button variant="outline" className="w-full text-sm" asChild>
            <Link href="/dashboard/my-ideas">My ideas</Link>
          </Button>
          <Button variant="outline" className="w-full text-sm" asChild>
            <Link href="/ideas">Browse all ideas</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
