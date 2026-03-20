// app/admin-dashboard/page.tsx — RSC

import { AdminOverview } from "@/components/admin/admin-overview";
import { redirect } from "next/navigation";
import { getAdminStatsAction, getAdminUserAction } from "./_action";

export default async function AdminDashboardPage() {
  const [user, stats] = await Promise.all([
    getAdminUserAction(),
    getAdminStatsAction().catch(() => null),
  ]);

  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return <AdminOverview user={user} initialStats={stats} />;
}
