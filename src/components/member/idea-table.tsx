// "use client";

// import { getMyIdeasAction } from "@/app/dashboard/my-ideas/_action";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { cn } from "@/lib/utils";
// import { IdeaListParams, IdeaStatus, PaginatedIdeas } from "@/types/api.types";
// import { STATUS_CONFIG } from "@/types/dashboard.types";
// import { format } from "date-fns";
// import { useCallback, useState, useTransition } from "react";
// import { IdeaRowActions } from "./idea-row-action";

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface MyIdeasTableProps {
//   initialData: PaginatedIdeas;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export function MyIdeasTable({ initialData }: MyIdeasTableProps) {
//   const [data, setData] = useState<PaginatedIdeas>(initialData);
//   const [params, setParams] = useState<IdeaListParams>({
//     page: 1,
//     limit: 10,
//     status: "ALL",
//     search: "",
//   });
//   const [isLoading, startTransition] = useTransition();

//   // ── Fetch with new params ──────────────────────────────────────────────────

//   const fetchIdeas = useCallback((newParams: IdeaListParams) => {
//     startTransition(async () => {
//       const result = await getMyIdeasAction(newParams);
//       setData(result);
//     });
//   }, []);

//   function updateParams(partial: Partial<IdeaListParams>) {
//     const updated = { ...params, ...partial };
//     // Reset to page 1 on filter/search change
//     if (partial.status !== undefined || partial.search !== undefined) {
//       updated.page = 1;
//     }
//     setParams(updated);
//     fetchIdeas(updated);
//   }

//   // ── After mutation (delete/submit) refetch current params ─────────────────

//   function handleMutate() {
//     fetchIdeas(params);
//   }

//   const ideas = data?.data ?? [];
//   const meta = data?.meta;

//   return (
//     <div className="space-y-3">
//       {/* ── Filters ─────────────────────────────────────────────────────── */}
//       <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//         <Input
//           placeholder="Search by title..."
//           className="h-9 sm:max-w-60"
//           defaultValue={params.search}
//           onChange={(e) => updateParams({ search: e.target.value })}
//         />

//         <Select
//           value={params.status ?? "ALL"}
//           onValueChange={(v) => updateParams({ status: v as IdeaStatus })}
//         >
//           <SelectTrigger className="h-9 sm:w-44">
//             <SelectValue placeholder="All statuses" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="ALL">All statuses</SelectItem>
//             <SelectItem value="DRAFT">Draft</SelectItem>
//             <SelectItem value="UNDER_REVIEW">Under review</SelectItem>
//             <SelectItem value="APPROVED">Approved</SelectItem>
//             <SelectItem value="REJECTED">Rejected</SelectItem>
//           </SelectContent>
//         </Select>

//         {isLoading && (
//           <span className="text-xs text-muted-foreground sm:ml-auto animate-pulse">
//             Loading...
//           </span>
//         )}

//         {meta && !isLoading && (
//           <span className="text-xs text-muted-foreground sm:ml-auto">
//             {meta.total} idea{meta.total !== 1 ? "s" : ""}
//           </span>
//         )}
//       </div>

//       {/* ── Table ────────────────────────────────────────────────────────── */}
//       <div className="rounded-lg border overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-muted/40">
//               <TableHead className="w-[38%]">Title</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Votes</TableHead>
//               <TableHead>Created</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {isLoading ? (
//               // Skeleton rows while fetching
//               Array.from({ length: 5 }).map((_, i) => (
//                 <TableRow key={i}>
//                   {Array.from({ length: 7 }).map((_, j) => (
//                     <TableCell key={j}>
//                       <Skeleton className="h-4 w-full" />
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : ideas.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={7}
//                   className="h-36 text-center text-sm text-muted-foreground"
//                 >
//                   {params.search || params.status !== "ALL"
//                     ? "No ideas match your filters."
//                     : "You haven't created any ideas yet."}
//                 </TableCell>
//               </TableRow>
//             ) : (
//               ideas.map((idea) => {
//                 const statusCfg =
//                   STATUS_CONFIG[idea.status as keyof typeof STATUS_CONFIG];

//                 return (
//                   <TableRow key={idea.id} className="group">
//                     {/* Title + rejection feedback */}
//                     <TableCell className="font-medium">
//                       <div className="flex flex-col gap-0.5">
//                         <span className="line-clamp-1">{idea.title}</span>
//                         {idea.rejectionFeedback && (
//                           <TooltipProvider>
//                             <Tooltip>
//                               <TooltipTrigger asChild>
//                                 <span className="text-xs text-destructive cursor-help line-clamp-1 w-fit">
//                                   Feedback: {idea.rejectionFeedback}
//                                 </span>
//                               </TooltipTrigger>
//                               <TooltipContent
//                                 side="bottom"
//                                 className="max-w-72 text-xs"
//                               >
//                                 {idea.rejectionFeedback}
//                               </TooltipContent>
//                             </Tooltip>
//                           </TooltipProvider>
//                         )}
//                       </div>
//                     </TableCell>

//                     {/* Category */}
//                     <TableCell className="text-sm">
//                       {idea.category?.name ?? "—"}
//                     </TableCell>

//                     {/* Status badge */}
//                     <TableCell>
//                       <Badge
//                         className={cn(
//                           "text-xs font-medium",
//                           statusCfg?.badgeClass,
//                         )}
//                       >
//                         {statusCfg?.label ?? idea.status}
//                       </Badge>
//                     </TableCell>

//                     {/* Free / Paid */}
//                     <TableCell>
//                       {idea.isPaid ? (
//                         <Badge
//                           variant="outline"
//                           className="text-xs text-purple-700 border-purple-300"
//                         >
//                           Paid
//                         </Badge>
//                       ) : (
//                         <Badge
//                           variant="outline"
//                           className="text-xs text-green-700 border-green-300"
//                         >
//                           Free
//                         </Badge>
//                       )}
//                     </TableCell>

//                     {/* Vote count */}
//                     <TableCell className="text-sm text-muted-foreground">
//                       ▲ {idea._count?.votes ?? 0}
//                     </TableCell>

//                     {/* Date */}
//                     <TableCell className="text-xs text-muted-foreground">
//                       {format(new Date(idea.createdAt), "dd MMM yyyy")}
//                     </TableCell>

//                     {/* Actions */}
//                     <TableCell className="text-right">
//                       <IdeaRowActions idea={idea} onMutate={handleMutate} />
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* ── Pagination ───────────────────────────────────────────────────── */}
//       {meta && meta.totalPages > 1 && (
//         <div className="flex items-center justify-between pt-1">
//           <p className="text-xs text-muted-foreground">
//             Page {meta.page} of {meta.totalPages} &nbsp;&bull;&nbsp;{" "}
//             {(meta.page - 1) * meta.limit + 1}–
//             {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
//           </p>
//           <div className="flex gap-2">
//             <Button
//               size="sm"
//               variant="outline"
//               className="h-8 text-xs"
//               disabled={meta.page <= 1 || isLoading}
//               onClick={() => updateParams({ page: meta.page - 1 })}
//             >
//               Previous
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               className="h-8 text-xs"
//               disabled={meta.page >= meta.totalPages || isLoading}
//               onClick={() => updateParams({ page: meta.page + 1 })}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { getMyIdeasAction } from "@/app/dashboard/my-ideas/_action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IdeaListParams, IdeaStatus, PaginatedIdeas } from "@/types/api.types";
import { STATUS_CONFIG } from "@/types/dashboard.types";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { IdeaRowActions } from "./idea-row-action";

interface MyIdeasTableProps {
  initialData: PaginatedIdeas;
}

export function MyIdeasTable({ initialData }: MyIdeasTableProps) {
  const [data, setData] = useState<PaginatedIdeas>(initialData);
  const [params, setParams] = useState<IdeaListParams>({
    page: 1,
    limit: 10,
    status: "ALL",
    search: "",
  });
  const [isLoading, startTransition] = useTransition();

  const fetchIdeas = useCallback((newParams: IdeaListParams) => {
    startTransition(async () => {
      const result = await getMyIdeasAction(newParams);
      setData(result);
    });
  }, []);

  function updateParams(partial: Partial<IdeaListParams>) {
    const updated = { ...params, ...partial };
    if (partial.status !== undefined || partial.search !== undefined) {
      updated.page = 1;
    }
    setParams(updated);
    fetchIdeas(updated);
  }

  function handleMutate() {
    fetchIdeas(params);
  }

  const ideas = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-3">
      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-60 w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by title..."
            className="h-8 pl-8 text-[13px]"
            defaultValue={params.search}
            onChange={(e) => updateParams({ search: e.target.value })}
          />
        </div>

        <Select
          value={params.status ?? "ALL"}
          onValueChange={(v) => updateParams({ status: v as IdeaStatus })}
        >
          <SelectTrigger className="h-8 text-[13px] sm:w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL" className="text-[13px]">
              All statuses
            </SelectItem>
            <SelectItem value="DRAFT" className="text-[13px]">
              Draft
            </SelectItem>
            <SelectItem value="UNDER_REVIEW" className="text-[13px]">
              Under review
            </SelectItem>
            <SelectItem value="APPROVED" className="text-[13px]">
              Approved
            </SelectItem>
            <SelectItem value="REJECTED" className="text-[13px]">
              Rejected
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="sm:ml-auto flex items-center gap-2 min-h-[20px]">
          {isLoading && (
            <span className="text-[12px] text-muted-foreground animate-pulse">
              Loading…
            </span>
          )}
          {meta && !isLoading && (
            <span className="text-[12px] text-muted-foreground">
              {meta.total} idea{meta.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* ── Table — overflow-x-auto so scrollbar appears at the bottom ─── */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[34%] text-[12px] font-semibold py-2.5">
                  Title
                </TableHead>
                <TableHead className="text-[12px] font-semibold py-2.5">
                  Category
                </TableHead>
                <TableHead className="text-[12px] font-semibold py-2.5">
                  Status
                </TableHead>
                <TableHead className="text-[12px] font-semibold py-2.5">
                  Type
                </TableHead>
                <TableHead className="text-[12px] font-semibold py-2.5">
                  Votes
                </TableHead>
                <TableHead className="text-[12px] font-semibold py-2.5">
                  Created
                </TableHead>
                <TableHead className="text-right text-[12px] font-semibold py-2.5">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j} className="py-3">
                        <Skeleton className="h-3.5 w-full rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : ideas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-36 text-center text-[13px] text-muted-foreground"
                  >
                    {params.search || params.status !== "ALL"
                      ? "No ideas match your filters."
                      : "You haven't created any ideas yet."}
                  </TableCell>
                </TableRow>
              ) : (
                ideas.map((idea) => {
                  const statusCfg =
                    STATUS_CONFIG[idea.status as keyof typeof STATUS_CONFIG];

                  return (
                    <TableRow key={idea.id} className="group">
                      {/* Title + rejection feedback */}
                      <TableCell className="py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] font-medium line-clamp-1 leading-snug">
                            {idea.title}
                          </span>
                          {idea.rejectionFeedback && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-[11px] text-destructive cursor-help line-clamp-1 w-fit leading-snug">
                                    Feedback: {idea.rejectionFeedback}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  className="max-w-72 text-[12px]"
                                >
                                  {idea.rejectionFeedback}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="text-[13px] text-muted-foreground py-3">
                        {idea.category?.name ?? "—"}
                      </TableCell>

                      {/* Status badge */}
                      <TableCell className="py-3">
                        <Badge
                          className={cn(
                            "text-[11px] font-medium px-2 py-0.5",
                            statusCfg?.badgeClass,
                          )}
                        >
                          {statusCfg?.label ?? idea.status}
                        </Badge>
                      </TableCell>

                      {/* Free / Paid */}
                      <TableCell className="py-3">
                        {idea.isPaid ? (
                          <Badge
                            variant="outline"
                            className="text-[11px] font-medium px-2 py-0.5 text-purple-700 border-purple-300"
                          >
                            Paid
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[11px] font-medium px-2 py-0.5 text-green-700 border-green-300"
                          >
                            Free
                          </Badge>
                        )}
                      </TableCell>

                      {/* Vote count */}
                      <TableCell className="text-[13px] text-muted-foreground py-3">
                        ▲ {idea._count?.votes ?? 0}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-[12px] text-muted-foreground py-3 whitespace-nowrap">
                        {format(new Date(idea.createdAt), "dd MMM yyyy")}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right py-3">
                        <IdeaRowActions idea={idea} onMutate={handleMutate} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-[12px] text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
            <span className="mx-1.5 opacity-40">•</span>
            {(meta.page - 1) * meta.limit + 1}–
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
          </p>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2.5 text-[12px] gap-1"
              disabled={meta.page <= 1 || isLoading}
              onClick={() => updateParams({ page: meta.page - 1 })}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2.5 text-[12px] gap-1"
              disabled={meta.page >= meta.totalPages || isLoading}
              onClick={() => updateParams({ page: meta.page + 1 })}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
