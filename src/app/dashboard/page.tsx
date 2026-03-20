// app/dashboard/page.tsx — RSC
// Parallel fetch: user info + member stats

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { redirect } from "next/navigation";
import { getCurrentUserAction, getMemberStatsAction } from "./_action";

export default async function MemberDashboardPage() {
  // Parallel fetch — faster than sequential
  const [user, stats] = await Promise.all([
    getCurrentUserAction(),
    getMemberStatsAction().catch(() => null),
  ]);

  if (!user) {
    redirect("/login");
  }

  return <DashboardOverview user={user} initialStats={stats} />;
}
