// "use client";

// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { AdminDashboardStats } from "@/types/api.types";
// import Link from "next/link";
// import { useState } from "react";
// import { AdminCharts } from "./admin-chart";
// import { AdminStatsGrid } from "./admin-stats-grid";
// import { NewMembersList } from "./new-member";
// import { PendingIdeasList } from "./pending-idea-table";

// interface User {
//   name: string;
//   email: string;
//   role: string;
// }

// interface AdminOverviewProps {
//   user: User;
//   initialStats: AdminDashboardStats | null;
// }

// export function AdminOverview({ user, initialStats }: AdminOverviewProps) {
//   // stats in state so approve/reject can refresh without page reload
//   const [stats, setStats] = useState<AdminDashboardStats | null>(initialStats);

//   return (
//     <div className="space-y-5">
//       {/* ── Header ───────────────────────────────────────────────────────── */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight">
//             Admin dashboard
//           </h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             Welcome back,  Platform overview below.
//           </p>
//         </div>
//         <div className="flex gap-2 shrink-0">
//           <Button size="sm" variant="outline" asChild>
//             <Link href="/admin-dashboard/ideas">All ideas</Link>
//           </Button>
//           <Button size="sm" variant="outline" asChild>
//             <Link href="/admin-dashboard/members">Members</Link>
//           </Button>
//         </div>
//       </div>

//       {/* ── Row 1: stat cards ─────────────────────────────────────────────── */}
//       {stats ? (
//         <AdminStatsGrid stats={stats} />
//       ) : (
//         <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <Skeleton key={i} className="h-28 rounded-xl" />
//           ))}
//         </div>
//       )}

//       {/* ── Row 2: donut + bar charts ─────────────────────────────────────── */}
//       {stats ? (
//         <AdminCharts stats={stats} />
//       ) : (
//         <div className="grid gap-4 lg:grid-cols-2">
//           <Skeleton className="h-52 rounded-xl" />
//           <Skeleton className="h-52 rounded-xl" />
//         </div>
//       )}

//       {/* ── Row 3: pending ideas + new members ───────────────────────────── */}
//       <div className="grid gap-4 lg:grid-cols-2">
//         {stats ? (
//           <>
//             <PendingIdeasList
//               initialIdeas={stats.recentActivities.pendingIdeas}
//               onStatsRefresh={setStats}
//             />
//             <NewMembersList users={stats.recentActivities.newUsers} />
//           </>
//         ) : (
//           <>
//             <Skeleton className="h-72 rounded-xl" />
//             <Skeleton className="h-72 rounded-xl" />
//           </>
//         )}
//       </div>

//       {/* ── Quick actions ─────────────────────────────────────────────────── */}
//       <div className="rounded-xl border bg-card p-5 space-y-3">
//         <h3 className="text-sm font-medium">Quick actions</h3>
//         <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
//           <Button variant="outline" className="w-full text-sm" asChild>
//             <Link href="/admin-dashboard/ideas?status=UNDER_REVIEW">
//               Review ideas
//             </Link>
//           </Button>
//           <Button variant="outline" className="w-full text-sm" asChild>
//             <Link href="/admin-dashboard/ideas">All ideas</Link>
//           </Button>
//           <Button variant="outline" className="w-full text-sm" asChild>
//             <Link href="/admin-dashboard/members">Members</Link>
//           </Button>
//           <Button variant="outline" className="w-full text-sm" asChild>
//             <Link href="/admin-dashboard/categories">Categories</Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminDashboardStats } from "@/types/api.types";
import { LayoutGrid, ListFilter, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminCharts } from "./admin-chart";
import { AdminStatsGrid } from "./admin-stats-grid";
import { NewMembersList } from "./new-member";
import { PendingIdeasList } from "./pending-idea-table";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AdminOverviewProps {
  user: User;
  initialStats: AdminDashboardStats | null;
}

export function AdminOverview({ user, initialStats }: AdminOverviewProps) {
  const [stats, setStats] = useState<AdminDashboardStats | null>(initialStats);

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Admin dashboard
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Welcome back,{" "}
            <span className="font-medium text-foreground">{user.name}</span>.
            Platform overview below.
          </p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-[13px] gap-1.5"
            asChild
          >
            <Link href="/admin-dashboard/ideas">
              <LayoutGrid className="w-3.5 h-3.5" />
              All ideas
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-[13px] gap-1.5"
            asChild
          >
            <Link href="/admin-dashboard/members">
              <Users className="w-3.5 h-3.5" />
              Members
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Row 1: stat cards ─────────────────────────────────────────────── */}
      {stats ? (
        <AdminStatsGrid stats={stats} />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}

      {/* ── Row 2: donut + payment area chart ────────────────────────────── */}
      {stats ? (
        <AdminCharts stats={stats} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-52 rounded-xl" />
          <Skeleton className="h-52 rounded-xl" />
        </div>
      )}

      {/* ── Row 3: pending ideas + new members ───────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {stats ? (
          <>
            <PendingIdeasList
              initialIdeas={stats.recentActivities.pendingIdeas}
              onStatsRefresh={setStats}
            />
            <NewMembersList users={stats.recentActivities.newUsers} />
          </>
        ) : (
          <>
            <Skeleton className="h-72 rounded-xl" />
            <Skeleton className="h-72 rounded-xl" />
          </>
        )}
      </div>

      {/* ── Quick actions ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-card p-5 space-y-3">
        <div className="flex items-center gap-1.5">
          <ListFilter className="w-3.5 h-3.5 text-muted-foreground" />
          <h3 className="text-[13px] font-semibold">Quick actions</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            {
              href: "/admin-dashboard/ideas?status=UNDER_REVIEW",
              label: "Review ideas",
            },
            { href: "/admin-dashboard/ideas", label: "All ideas" },
            { href: "/admin-dashboard/members", label: "Members" },
            { href: "/admin-dashboard/categories", label: "Categories" },
          ].map((item) => (
            <Button
              key={item.href}
              variant="outline"
              size="sm"
              className="w-full h-8 text-[13px]"
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
