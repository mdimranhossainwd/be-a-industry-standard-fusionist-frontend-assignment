"use client";

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
import { format } from "date-fns";
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AdminUserSummary,
  deleteUserAction,
  getUsersAction,
  updateUserRoleAction,
  updateUserStatusAction,
  type UserRole,
} from "./_action";

// ─── Config ───────────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  ADMIN: {
    label: "Admin",
    className:
      "bg-violet-100 text-violet-700 border-transparent dark:bg-violet-900/30 dark:text-violet-400",
  },
  MEMBER: {
    label: "Member",
    className:
      "bg-blue-100 text-blue-700 border-transparent dark:bg-blue-900/30 dark:text-blue-400",
  },
};

const STATUS_CONFIG = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-emerald-100 text-emerald-700 border-transparent dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  BLOCKED: {
    label: "Blocked",
    className:
      "bg-red-100 text-red-700 border-transparent dark:bg-red-900/30 dark:text-red-400",
  },
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
];

const PAGE_SIZE = 10;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<AdminUserSummary[]>([]);
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "BLOCKED"
  >("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isLoading, startLoading] = useTransition();
  const [isActioning, startActioning] = useTransition();

  const [actioningId, setActioningId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "block" | "unblock" | "delete" | "role" | null
  >(null);

  const [blockTarget, setBlockTarget] = useState<AdminUserSummary | null>(null);
  const [unblockTarget, setUnblockTarget] = useState<AdminUserSummary | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<AdminUserSummary | null>(
    null,
  );

  // Role change state
  const [roleChangeTarget, setRoleChangeTarget] =
    useState<AdminUserSummary | null>(null);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  // ── Load ────────────────────────────────────────────────────────────────

  function loadUsers(opts?: { role?: "ALL" | UserRole; q?: string }) {
    const role = opts?.role ?? roleFilter;
    const q = opts?.q ?? activeSearch;
    startLoading(async () => {
      const data = await getUsersAction({
        role: role === "ALL" ? undefined : role,
        search: q || undefined,
      });
      setAllUsers(data);
      setPage(1);
    });
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Client-side filter by status ─────────────────────────────────────────

  const filtered = allUsers.filter((u) => {
    if (statusFilter !== "ALL" && u.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Summary counts ────────────────────────────────────────────────────────

  const totalCount = allUsers.length;
  const activeCount = allUsers.filter((u) => u.status === "ACTIVE").length;
  const blockedCount = allUsers.filter((u) => u.status === "BLOCKED").length;

  // ── Actions ───────────────────────────────────────────────────────────────

  function handleBlock() {
    if (!blockTarget) return;
    const id = blockTarget.id;
    setActioningId(id);
    setActionType("block");
    startActioning(async () => {
      const result = await updateUserStatusAction(id, "BLOCKED");
      setBlockTarget(null);
      setActioningId(null);
      setActionType(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, status: "BLOCKED" as const } : u,
        ),
      );
      toast.success(`${blockTarget.name} has been blocked.`);
    });
  }

  function handleUnblock() {
    if (!unblockTarget) return;
    const id = unblockTarget.id;
    setActioningId(id);
    setActionType("unblock");
    startActioning(async () => {
      const result = await updateUserStatusAction(id, "ACTIVE");
      setUnblockTarget(null);
      setActioningId(null);
      setActionType(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setAllUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, status: "ACTIVE" as const } : u,
        ),
      );
      toast.success(`${unblockTarget.name} has been unblocked.`);
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setActioningId(id);
    setActionType("delete");
    startActioning(async () => {
      const result = await deleteUserAction(id);
      setDeleteTarget(null);
      setActioningId(null);
      setActionType(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setAllUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(`${deleteTarget.name} has been deleted.`);
    });
  }

  // Role change: triggered when admin picks a new role from the inline Select
  function handleRoleSelectChange(user: AdminUserSummary, newRole: UserRole) {
    if (newRole === user.role) return;
    setRoleChangeTarget(user);
    setPendingRole(newRole);
  }

  function handleRoleChange() {
    if (!roleChangeTarget || !pendingRole) return;
    const id = roleChangeTarget.id;
    const targetName = roleChangeTarget.name;
    setActioningId(id);
    setActionType("role");
    startActioning(async () => {
      const result = await updateUserRoleAction(id, pendingRole);
      setRoleChangeTarget(null);
      setPendingRole(null);
      setActioningId(null);
      setActionType(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setAllUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: pendingRole } : u)),
      );
      toast.success(`${targetName}'s role updated to ${pendingRole}.`);
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              User management
            </h1>
            <p className="text-[13px] text-muted-foreground mt-1">
              View, search, and moderate all platform members
            </p>
          </div>

          {/* Summary mini-cards */}
          {!isLoading && (
            <div className="flex gap-2 shrink-0">
              <div className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 min-w-[52px]">
                <span className="text-[18px] font-bold leading-none">
                  {totalCount}
                </span>
                <span className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">
                  Total
                </span>
              </div>
              <div className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40 min-w-[52px]">
                <span className="text-[18px] font-bold leading-none text-emerald-700 dark:text-emerald-400">
                  {activeCount}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 mt-0.5 uppercase tracking-wide">
                  Active
                </span>
              </div>
              <div className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/40 min-w-[52px]">
                <span className="text-[18px] font-bold leading-none text-red-700 dark:text-red-400">
                  {blockedCount}
                </span>
                <span className="text-[10px] text-red-600 dark:text-red-500 mt-0.5 uppercase tracking-wide">
                  Blocked
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search */}
          <form
            className="relative w-full sm:max-w-60"
            onSubmit={(e) => {
              e.preventDefault();
              setActiveSearch(searchInput);
              loadUsers({ q: searchInput });
            }}
          >
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name or email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-8 pl-8 pr-14 text-[13px]"
            />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-2 text-[11px]"
            >
              Go
            </Button>
          </form>

          {/* Role filter */}
          <Select
            value={roleFilter}
            onValueChange={(v) => {
              const r = v as "ALL" | UserRole;
              setRoleFilter(r);
              loadUsers({ role: r });
            }}
          >
            <SelectTrigger className="h-8 w-36 text-[13px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-[13px]">
                All roles
              </SelectItem>
              <SelectItem value="MEMBER" className="text-[13px]">
                Members
              </SelectItem>
              <SelectItem value="ADMIN" className="text-[13px]">
                Admins
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as "ALL" | "ACTIVE" | "BLOCKED");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-36 text-[13px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-[13px]">
                All statuses
              </SelectItem>
              <SelectItem value="ACTIVE" className="text-[13px]">
                Active
              </SelectItem>
              <SelectItem value="BLOCKED" className="text-[13px]">
                Blocked
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="sm:ml-auto flex items-center gap-2 min-h-5">
            {isLoading ? (
              <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading…
              </span>
            ) : (
              <span className="text-[12px] text-muted-foreground">
                {filtered.length} user{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="text-[12px] font-semibold py-2.5 w-[32%]">
                    User
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold py-2.5">
                    Role
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold py-2.5">
                    Status
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold py-2.5">
                    Ideas
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold py-2.5">
                    Joined
                  </TableHead>
                  <TableHead className="text-right text-[12px] font-semibold py-2.5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2.5">
                          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                          <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-2.5 w-40" />
                          </div>
                        </div>
                      </TableCell>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j} className="py-3">
                          <Skeleton className="h-3.5 w-full rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-36 text-center text-[13px] text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-muted-foreground/30" />
                        No users found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((user, idx) => {
                    const globalIdx = (page - 1) * PAGE_SIZE + idx;
                    const isBusy = actioningId === user.id && isActioning;
                    const isBlocked = user.status === "BLOCKED";
                    const isAdmin = user.role === "ADMIN";
                    const statusCfg =
                      STATUS_CONFIG[user.status] ?? STATUS_CONFIG.ACTIVE;

                    return (
                      <TableRow
                        key={user.id}
                        className={cn(
                          "transition-opacity",
                          isBusy && "opacity-50 pointer-events-none",
                          isBlocked && "bg-red-50/40 dark:bg-red-950/10",
                        )}
                      >
                        {/* User */}
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                                AVATAR_COLORS[globalIdx % AVATAR_COLORS.length],
                              )}
                            >
                              {getInitials(user.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium line-clamp-1 leading-snug">
                                {user.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Role — inline Select for non-admins, protected badge for admins */}
                        <TableCell className="py-3">
                          {isAdmin ? (
                            <Badge
                              className={cn(
                                "text-[11px] font-medium px-2 py-0.5",
                                ROLE_CONFIG.ADMIN.className,
                              )}
                            >
                              {ROLE_CONFIG.ADMIN.label}
                            </Badge>
                          ) : (
                            <Select
                              value={user.role}
                              disabled={isActioning}
                              onValueChange={(v) =>
                                handleRoleSelectChange(user, v as UserRole)
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  "h-7 w-28 text-[11px] font-medium border px-2 gap-1",
                                  ROLE_CONFIG[user.role].className,
                                  "focus:ring-1 focus:ring-offset-0",
                                )}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value="MEMBER"
                                  className="text-[12px]"
                                >
                                  Member
                                </SelectItem>
                                <SelectItem
                                  value="ADMIN"
                                  className="text-[12px]"
                                >
                                  Admin
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-3">
                          <Badge
                            className={cn(
                              "text-[11px] font-medium px-2 py-0.5",
                              statusCfg.className,
                            )}
                          >
                            {statusCfg.label}
                          </Badge>
                        </TableCell>

                        {/* Ideas count */}
                        <TableCell className="text-[13px] text-muted-foreground py-3">
                          {user._count?.ideas ?? 0}
                        </TableCell>

                        {/* Joined */}
                        <TableCell className="text-[12px] text-muted-foreground py-3 whitespace-nowrap">
                          {format(new Date(user.createdAt), "dd MMM yyyy")}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right py-3">
                          {isAdmin ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2 cursor-default">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Protected
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="left"
                                  className="text-[12px]"
                                >
                                  Admin accounts cannot be moderated
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              {/* Block / Unblock */}
                              {isBlocked ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2.5 text-[12px] gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                                  disabled={isActioning}
                                  onClick={() => setUnblockTarget(user)}
                                >
                                  {isBusy && actionType === "unblock" ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <UserCheck className="w-3.5 h-3.5" />
                                  )}
                                  {isBusy && actionType === "unblock"
                                    ? "Unblocking…"
                                    : "Unblock"}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2.5 text-[12px] gap-1.5 text-amber-700 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950"
                                  disabled={isActioning}
                                  onClick={() => setBlockTarget(user)}
                                >
                                  {isBusy && actionType === "block" ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Ban className="w-3.5 h-3.5" />
                                  )}
                                  {isBusy && actionType === "block"
                                    ? "Blocking…"
                                    : "Block"}
                                </Button>
                              )}

                              {/* Delete */}
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2.5 text-[12px] gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                                disabled={isActioning}
                                onClick={() => setDeleteTarget(user)}
                              >
                                {isBusy && actionType === "delete" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                                {isBusy && actionType === "delete"
                                  ? "Deleting…"
                                  : "Delete"}
                              </Button>
                            </div>
                          )}
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <p className="text-[12px] text-muted-foreground">
              Page {page} of {totalPages}
              <span className="mx-1.5 opacity-40">·</span>
              {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-[12px] gap-1"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-[12px] gap-1"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Block confirm */}
      <AlertDialog
        open={!!blockTarget}
        onOpenChange={(o) => !isActioning && !o && setBlockTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[15px]">
              Block this user?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">
              <span className="font-medium text-foreground">
                {blockTarget?.name}
              </span>{" "}
              ({blockTarget?.email}) will lose platform access. You can unblock
              them at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isActioning}
              className="h-8 text-[13px]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-[13px] gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleBlock}
              disabled={isActioning}
            >
              {isActioning && actionType === "block" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Ban className="w-3.5 h-3.5" />
              )}
              {isActioning && actionType === "block"
                ? "Blocking…"
                : "Block user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unblock confirm */}
      <AlertDialog
        open={!!unblockTarget}
        onOpenChange={(o) => !isActioning && !o && setUnblockTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[15px]">
              Unblock this user?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">
              <span className="font-medium text-foreground">
                {unblockTarget?.name}
              </span>{" "}
              ({unblockTarget?.email}) will regain full platform access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isActioning}
              className="h-8 text-[13px]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-[13px] gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleUnblock}
              disabled={isActioning}
            >
              {isActioning && actionType === "unblock" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
              {isActioning && actionType === "unblock"
                ? "Unblocking…"
                : "Unblock user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !isActioning && !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[15px]">
              Delete this user?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>{" "}
              will be permanently removed along with all their data. This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isActioning}
              className="h-8 text-[13px]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-[13px] gap-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isActioning}
            >
              {isActioning && actionType === "delete" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              {isActioning && actionType === "delete"
                ? "Deleting…"
                : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role change confirm */}
      <AlertDialog
        open={!!roleChangeTarget}
        onOpenChange={(o) =>
          !isActioning &&
          !o &&
          (setRoleChangeTarget(null), setPendingRole(null))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[15px]">
              Change user role?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px]">
              <span className="font-medium text-foreground">
                {roleChangeTarget?.name}
              </span>{" "}
              ({roleChangeTarget?.email}) will be changed from{" "}
              <span className="font-medium text-foreground">
                {roleChangeTarget?.role}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">{pendingRole}</span>
              .{" "}
              {pendingRole === "ADMIN"
                ? "This will grant them full admin privileges."
                : "This will remove their admin privileges."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isActioning}
              className="h-8 text-[13px]"
              onClick={() => setPendingRole(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-[13px] gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
              onClick={handleRoleChange}
              disabled={isActioning}
            >
              {isActioning && actionType === "role" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UserCog className="w-3.5 h-3.5" />
              )}
              {isActioning && actionType === "role"
                ? "Updating…"
                : "Confirm role change"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
