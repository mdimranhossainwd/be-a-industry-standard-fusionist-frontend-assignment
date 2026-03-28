// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { AdminNewUser } from "@/types/api.types";
// import { format } from "date-fns";

// interface NewMembersListProps {
//   users: AdminNewUser[];
// }

// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();
// }

// const AVATAR_COLORS = [
//   "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
//   "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
//   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
//   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
//   "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
// ];

// export function NewMembersList({ users }: NewMembersListProps) {
//   return (
//     <div className="rounded-xl border bg-card p-5 space-y-4">
//       <div className="flex items-center justify-between">
//         <h3 className="text-sm font-medium">New members</h3>
//         <span className="text-xs text-muted-foreground">
//           {users.length} recent
//         </span>
//       </div>

//       {users.length === 0 ? (
//         <div className="py-8 text-center">
//           <p className="text-sm text-muted-foreground">No new members yet</p>
//         </div>
//       ) : (
//         <div className="divide-y divide-border/50">
//           {users.map((user, i) => (
//             <div key={user.id} className="py-2.5 flex items-center gap-3">
//               {/* Avatar */}
//               <div
//                 className={cn(
//                   "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
//                   AVATAR_COLORS[i % AVATAR_COLORS.length],
//                 )}
//               >
//                 {getInitials(user.name)}
//               </div>

//               {/* Info */}
//               <div className="min-w-0 flex-1">
//                 <p className="text-sm font-medium line-clamp-1">{user.name}</p>
//                 <p className="text-xs text-muted-foreground line-clamp-1">
//                   {user.email}
//                 </p>
//               </div>

//               {/* Role + date */}
//               <div className="flex flex-col items-end gap-1 shrink-0">
//                 <Badge
//                   className={cn(
//                     "text-xs h-5 px-1.5",
//                     user.role === "ADMIN"
//                       ? "bg-purple-100 text-purple-700 border-transparent dark:bg-purple-900/30 dark:text-purple-400"
//                       : "bg-blue-100 text-blue-700 border-transparent dark:bg-blue-900/30 dark:text-blue-400",
//                   )}
//                 >
//                   {user.role.toLowerCase()}
//                 </Badge>
//                 <span className="text-xs text-muted-foreground">
//                   {format(new Date(user.createdAt), "dd MMM")}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AdminNewUser } from "@/types/api.types";
import { format } from "date-fns";

interface NewMembersListProps {
  users: AdminNewUser[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
];

export function NewMembersList({ users }: NewMembersListProps) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold text-foreground">
            New members
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Recently joined users
          </p>
        </div>
        <span className="text-[11px] font-medium bg-muted/60 px-2 py-1 rounded-md text-muted-foreground">
          {users.length} recent
        </span>
      </div>

      {users.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-[13px] text-muted-foreground">
            No new members yet
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {users.map((user, i) => (
            <div key={user.id} className="py-2.5 flex items-center gap-3">
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 tracking-wide",
                  AVATAR_COLORS[i % AVATAR_COLORS.length],
                )}
              >
                {getInitials(user.name)}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium line-clamp-1 leading-snug">
                  {user.name}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                  {user.email}
                </p>
              </div>

              {/* Role + date */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <Badge
                  className={cn(
                    "text-[10px] h-5 px-1.5 font-medium",
                    user.role === "ADMIN"
                      ? "bg-violet-100 text-violet-700 border-transparent dark:bg-violet-900/30 dark:text-violet-400"
                      : "bg-blue-100 text-blue-700 border-transparent dark:bg-blue-900/30 dark:text-blue-400",
                  )}
                >
                  {user.role.toLowerCase()}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {format(new Date(user.createdAt), "dd MMM")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
