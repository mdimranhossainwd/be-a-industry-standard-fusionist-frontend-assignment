"use client";

import {
  AdminIdeaQueryParams,
  approveIdeaAction,
  deleteIdeaAction,
  getAdminIdeasAction,
  rejectIdeaAction,
  toggleHighlightAction,
} from "@/app/admin/all-ideas/_action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Category, Idea, PaginatedIdeas } from "@/types/api.types";
import { format } from "date-fns";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-transparent",
  },
  UNDER_REVIEW: {
    label: "Under review",
    className:
      "bg-amber-100 text-amber-800 border-transparent dark:bg-amber-900/30 dark:text-amber-400",
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-emerald-100 text-emerald-800 border-transparent dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    className:
      "bg-red-100 text-red-800 border-transparent dark:bg-red-900/30 dark:text-red-400",
  },
} as const;

const SORT_OPTIONS = [
  { value: "createdAt__desc", label: "Newest first" },
  { value: "createdAt__asc", label: "Oldest first" },
  { value: "title__asc", label: "Title A–Z" },
  { value: "title__desc", label: "Title Z–A" },
  { value: "updatedAt__desc", label: "Recently updated" },
  { value: "status__asc", label: "Status A–Z" },
];

interface AdminIdeasClientProps {
  initialIdeas: PaginatedIdeas;
  categories: Category[];
}

export function AdminIdeasClient({
  initialIdeas,
  categories,
}: AdminIdeasClientProps) {
  const [data, setData] = useState<PaginatedIdeas>(initialIdeas);
  const [params, setParams] = useState<AdminIdeaQueryParams>({
    page: 1,
    limit: 2,
    status: "ALL",
    search: "",
    category: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [isFetching, startFetching] = useTransition();
  const [isApproving, startApproving] = useTransition();
  const [isRejecting, startRejecting] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [isHighlighting, startHighlighting] = useTransition();

  // Track which idea is being actioned for per-row loading
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "delete" | "highlight" | null
  >(null);

  const [approveTarget, setApproveTarget] = useState<Idea | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Idea | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Idea | null>(null);
  const [feedback, setFeedback] = useState("");

  const ideas = data?.data ?? [];
  const meta = data?.meta;

  function fetchIdeas(newParams: AdminIdeaQueryParams) {
    startFetching(async () => {
      const result = await getAdminIdeasAction(newParams);
      setData(result);
    });
  }

  function updateParams(partial: Partial<AdminIdeaQueryParams>) {
    const updated: AdminIdeaQueryParams = { ...params, ...partial };
    if (!("page" in partial)) updated.page = 1;
    setParams(updated);
    fetchIdeas(updated);
  }

  function handleSortChange(value: string) {
    const [sortBy, sortOrder] = value.split("__") as [
      AdminIdeaQueryParams["sortBy"],
      AdminIdeaQueryParams["sortOrder"],
    ];
    updateParams({ sortBy, sortOrder });
  }

  function refetchCurrent() {
    fetchIdeas(params);
  }

  function handleApprove() {
    if (!approveTarget) return;
    const id = approveTarget.id;
    setActioningId(id);
    setActionType("approve");
    startApproving(async () => {
      const result = await approveIdeaAction(id);
      setApproveTarget(null);
      setActioningId(null);
      setActionType(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Idea approved!");
      refetchCurrent();
    });
  }

  function handleReject() {
    if (!rejectTarget || feedback.trim().length < 10) return;
    const id = rejectTarget.id;
    setActioningId(id);
    setActionType("reject");
    startRejecting(async () => {
      const result = await rejectIdeaAction(id, feedback.trim());
      setRejectTarget(null);
      setActioningId(null);
      setActionType(null);
      setFeedback("");
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Idea rejected.");
      refetchCurrent();
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setActioningId(id);
    setActionType("delete");
    startDeleting(async () => {
      const result = await deleteIdeaAction(id);
      setDeleteTarget(null);
      setActioningId(null);
      setActionType(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Idea deleted.");
      refetchCurrent();
    });
  }

  function handleToggleHighlight(idea: Idea) {
    const id = idea.id;
    const newVal = !idea.isHighlighted;
    setActioningId(id);
    setActionType("highlight");
    startHighlighting(async () => {
      const result = await toggleHighlightAction(id, newVal);
      setActioningId(null);
      setActionType(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      // Optimistic update — no refetch needed
      setData((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data.map((i) =>
                i.id === id ? { ...i, isHighlighted: newVal } : i,
              ),
            }
          : prev,
      );
      toast.success(
        newVal
          ? `"${idea.title}" highlighted.`
          : `"${idea.title}" highlight removed.`,
      );
    });
  }

  const isActionPending =
    isApproving || isRejecting || isDeleting || isHighlighting;

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              All ideas Management
            </h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              Manage, approve, reject, and delete ideas
            </p>
          </div>
          {meta && !isFetching && (
            <span className="text-[12px] text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
              {meta.total} idea{meta.total !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative w-full sm:max-w-52">
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
            onValueChange={(v) =>
              updateParams({ status: v as AdminIdeaQueryParams["status"] })
            }
          >
            <SelectTrigger className="h-8 w-40 text-[13px]">
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

          <Select
            value={params.category ?? "ALL"}
            onValueChange={(v) =>
              updateParams({ category: v === "ALL" ? "" : v })
            }
          >
            <SelectTrigger className="h-8 w-44 text-[13px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-[13px]">
                All categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.slug ?? cat.id}
                  className="text-[13px]"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={`${params.sortBy}__${params.sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="h-8 w-44 text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="text-[13px]"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isFetching && (
            <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading…
            </span>
          )}
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[820px]">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[28%] text-[12px] font-semibold py-2.5">
                    Title
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold py-2.5">
                    Author
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
                    Date
                  </TableHead>
                  <TableHead className="text-right text-[12px] font-semibold py-2.5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j} className="py-3">
                          <Skeleton className="h-3.5 w-full rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : ideas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-36 text-center text-[13px] text-muted-foreground"
                    >
                      No ideas match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  ideas.map((idea) => {
                    const statusCfg =
                      STATUS_CONFIG[idea.status as keyof typeof STATUS_CONFIG];
                    const isBusy = actioningId === idea.id && isActionPending;

                    return (
                      <TableRow
                        key={idea.id}
                        className={cn(
                          isBusy && "opacity-60 pointer-events-none",
                          idea.isHighlighted &&
                            "bg-amber-50/50 dark:bg-amber-950/10 border-l-2 border-l-amber-400",
                        )}
                      >
                        {/* Title */}
                        <TableCell className="py-3">
                          <div className="flex items-start gap-1.5">
                            {idea.isHighlighted && (
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                            )}
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium line-clamp-1">
                                {idea.title}
                              </p>
                              {idea.rejectionFeedback && (
                                <p className="text-[11px] text-destructive mt-0.5 line-clamp-1">
                                  {idea.rejectionFeedback}
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Author */}
                        <TableCell className="text-[13px] text-muted-foreground py-3">
                          {idea.author?.name ?? "—"}
                        </TableCell>

                        {/* Category */}
                        <TableCell className="text-[13px] py-3">
                          {idea.category?.name ?? "—"}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-3">
                          <Badge
                            className={cn(
                              "text-[11px] font-medium px-2 py-0.5",
                              statusCfg?.className,
                            )}
                          >
                            {statusCfg?.label ?? idea.status}
                          </Badge>
                        </TableCell>

                        {/* Type */}
                        <TableCell className="py-3">
                          {idea.isPaid ? (
                            <Badge
                              variant="outline"
                              className="text-[11px] px-2 py-0.5 text-violet-700 border-violet-300"
                            >
                              Paid
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[11px] px-2 py-0.5 text-emerald-700 border-emerald-300"
                            >
                              Free
                            </Badge>
                          )}
                        </TableCell>

                        {/* Votes */}
                        <TableCell className="text-[13px] text-muted-foreground py-3">
                          ▲ {idea._count?.votes ?? 0}
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-[12px] text-muted-foreground py-3 whitespace-nowrap">
                          {format(new Date(idea.createdAt), "dd MMM yyyy")}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right py-3">
                          <div className="flex items-center justify-end gap-1">
                            {/* Highlight toggle */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className={cn(
                                      "h-7 w-7 p-0",
                                      idea.isHighlighted
                                        ? "text-amber-500 border-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40"
                                        : "text-muted-foreground hover:text-amber-500 hover:border-amber-300 hover:bg-amber-50",
                                    )}
                                    disabled={isActionPending}
                                    onClick={() => handleToggleHighlight(idea)}
                                  >
                                    {isBusy && actionType === "highlight" ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Star
                                        className="w-3.5 h-3.5"
                                        fill={
                                          idea.isHighlighted
                                            ? "currentColor"
                                            : "none"
                                        }
                                      />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="left"
                                  className="text-[12px]"
                                >
                                  {idea.isHighlighted
                                    ? "Remove highlight"
                                    : "Highlight idea"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Approve */}
                            {idea.status === "UNDER_REVIEW" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2.5 text-[12px] gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                                disabled={isActionPending}
                                onClick={() => setApproveTarget(idea)}
                              >
                                {isBusy && actionType === "approve" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                Approve
                              </Button>
                            )}

                            {/* Reject */}
                            {(idea.status === "UNDER_REVIEW" ||
                              idea.status === "APPROVED") && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2.5 text-[12px] gap-1.5 text-amber-700 border-amber-300 hover:bg-amber-50"
                                disabled={isActionPending}
                                onClick={() => {
                                  setRejectTarget(idea);
                                  setFeedback("");
                                }}
                              >
                                {isBusy && actionType === "reject" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5" />
                                )}
                                Reject
                              </Button>
                            )}

                            {/* Delete */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2.5 text-[12px] gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                              disabled={isActionPending}
                              onClick={() => setDeleteTarget(idea)}
                            >
                              {isBusy && actionType === "delete" ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-[12px] text-muted-foreground">
              Page {meta.page} of {meta.totalPages}
              <span className="mx-1.5 opacity-40">·</span>
              {(meta.page - 1) * meta.limit + 1}–
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
            </p>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-[12px] gap-1"
                disabled={meta.page <= 1 || isFetching}
                onClick={() => updateParams({ page: meta.page - 1 })}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-[12px] gap-1"
                disabled={meta.page >= meta.totalPages || isFetching}
                onClick={() => updateParams({ page: meta.page + 1 })}
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Approve dialog */}
      <AlertDialog
        open={!!approveTarget}
        onOpenChange={(o) => !isApproving && !o && setApproveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[15px]">
              Approve this idea?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">
              <span className="font-medium text-foreground">
                &ldquo;{approveTarget?.title}&rdquo;
              </span>{" "}
              will become publicly visible on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isApproving}
              className="h-8 text-[13px]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-[13px] gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              {isApproving ? "Approving…" : "Approve"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject dialog */}
      <Dialog
        open={!!rejectTarget}
        onOpenChange={(o) => !isRejecting && !o && setRejectTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[15px]">Reject idea</DialogTitle>
            <DialogDescription className="text-[13px]">
              Feedback is only visible to the submitter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="rounded-lg bg-muted/50 px-3 py-2.5">
              <p className="text-[13px] font-medium line-clamp-2">
                {rejectTarget?.title}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                by {rejectTarget?.author?.name}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="feedback" className="text-[13px] font-medium">
                Rejection reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="feedback"
                rows={4}
                className="text-[13px] resize-none"
                placeholder='e.g. "This idea lacks a feasibility study…"'
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              {feedback.length > 0 && feedback.trim().length < 10 && (
                <p className="text-[11px] text-destructive">
                  Min 10 characters required
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[13px]"
              onClick={() => setRejectTarget(null)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-8 text-[13px] gap-1.5"
              disabled={isRejecting || feedback.trim().length < 10}
              onClick={handleReject}
            >
              {isRejecting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <MessageSquare className="w-3.5 h-3.5" />
              )}
              {isRejecting ? "Rejecting…" : "Confirm reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !isDeleting && !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[15px]">
              Delete this idea?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">
              <span className="font-medium text-foreground">
                &ldquo;{deleteTarget?.title}&rdquo;
              </span>{" "}
              will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="h-8 text-[13px]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-[13px] gap-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
