// "use client";

// import { Button } from "@/components/ui/button";
// import { PaginatedIdeas } from "@/types/api.types";
// import Link from "next/link";
// import { MyIdeasTable } from "./idea-table";

// interface MyIdeasClientProps {
//   initialIdeas: PaginatedIdeas;
// }

// export function MyIdeasClient({ initialIdeas }: MyIdeasClientProps) {
//   return (
//     <div className="space-y-5">
//       {/* ── Page header ─────────────────────────────────────────────────── */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-lg font-medium text-foreground">My ideas</h1>
//           <p className="text-sm text-muted-foreground mt-0.5">
//             Manage, edit, and submit your sustainability ideas
//           </p>
//         </div>
//         <Button asChild size="sm">
//           <Link href="/dashboard/create-idea">+ New idea</Link>
//         </Button>
//       </div>

//       {/* ── Table ───────────────────────────────────────────────────────── */}
//       <MyIdeasTable initialData={initialIdeas} />
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { PaginatedIdeas } from "@/types/api.types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { MyIdeasTable } from "./idea-table";

interface MyIdeasClientProps {
  initialIdeas: PaginatedIdeas;
}

export function MyIdeasClient({ initialIdeas }: MyIdeasClientProps) {
  return (
    <div className="space-y-6">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            My Ideas
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1 leading-snug">
            Manage, edit, and submit your sustainability ideas
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="gap-1.5 h-8 text-[13px] font-medium"
        >
          <Link href="/dashboard/create-idea">
            <Plus className="w-3.5 h-3.5" />
            New idea
          </Link>
        </Button>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <MyIdeasTable initialData={initialIdeas} />
    </div>
  );
}
