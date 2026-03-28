// "use client";

// import {
//   approveIdeaAction,
//   getAdminStatsAction,
//   rejectIdeaAction,
// } from "@/app/admin/_action";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { AdminDashboardStats, AdminPendingIdea } from "@/types/api.types";
// import { format } from "date-fns";
// import { useState, useTransition } from "react";
// import { toast } from "sonner";

// interface PendingIdeasListProps {
//   initialIdeas: AdminPendingIdea[];
//   onStatsRefresh?: (stats: AdminDashboardStats) => void;
// }

// export function PendingIdeasList({
//   initialIdeas,
//   onStatsRefresh,
// }: PendingIdeasListProps) {
//   const [ideas, setIdeas] = useState<AdminPendingIdea[]>(initialIdeas);
//   const [approveTarget, setApproveTarget] = useState<AdminPendingIdea | null>(
//     null,
//   );
//   const [rejectTarget, setRejectTarget] = useState<AdminPendingIdea | null>(
//     null,
//   );
//   const [feedback, setFeedback] = useState("");
//   const [isApproving, startApproving] = useTransition();
//   const [isRejecting, startRejecting] = useTransition();

//   // Remove idea from local list after action
//   function removeIdea(id: string) {
//     setIdeas((prev) => prev.filter((i) => i.id !== id));
//   }

//   // Refresh stats after action
//   async function refreshStats() {
//     if (!onStatsRefresh) return;
//     try {
//       const fresh = await getAdminStatsAction();
//       onStatsRefresh(fresh);
//     } catch {
//       // silently fail — stats will update on next page load
//     }
//   }

//   function handleApprove() {
//     if (!approveTarget) return;
//     const id = approveTarget.id;
//     startApproving(async () => {
//       const result = await approveIdeaAction(id);
//       setApproveTarget(null);
//       if (!result.success) {
//         toast.error(result.error);
//         return;
//       }
//       toast.success("Idea approved!");
//       removeIdea(id);
//       refreshStats();
//     });
//   }

//   function handleReject() {
//     if (!rejectTarget || feedback.trim().length < 10) return;
//     const id = rejectTarget.id;
//     startRejecting(async () => {
//       const result = await rejectIdeaAction(id, feedback.trim());
//       setRejectTarget(null);
//       setFeedback("");
//       if (!result.success) {
//         toast.error(result.error);
//         return;
//       }
//       toast.success("Idea rejected with feedback.");
//       removeIdea(id);
//       refreshStats();
//     });
//   }

//   return (
//     <>
//       <div className="rounded-xl border bg-card p-5 space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-sm font-medium">Pending review</h3>
//             <p className="text-xs text-muted-foreground mt-0.5">
//               Approve or reject submitted ideas
//             </p>
//           </div>
//           <Badge className="bg-yellow-100 text-yellow-800 border-transparent dark:bg-yellow-900/30 dark:text-yellow-400">
//             {ideas.length} pending
//           </Badge>
//         </div>

//         {ideas.length === 0 ? (
//           <div className="py-10 text-center space-y-2">
//             <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="text-green-600 dark:text-green-400"
//               >
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//             </div>
//             <p className="text-sm font-medium">All caught up!</p>
//             <p className="text-xs text-muted-foreground">
//               No ideas waiting for review
//             </p>
//           </div>
//         ) : (
//           <div className="divide-y divide-border/50">
//             {ideas.map((idea) => (
//               <div
//                 key={idea.id}
//                 className="py-3 flex items-start justify-between gap-3"
//               >
//                 <div className="min-w-0 flex-1">
//                   <p className="text-sm font-medium line-clamp-1">
//                     {idea.title}
//                   </p>
//                   <div className="flex items-center gap-1.5 mt-1 flex-wrap">
//                     <span className="text-xs text-muted-foreground">
//                       {idea.author.name}
//                     </span>
//                     <span className="text-muted-foreground/40 text-xs">·</span>
//                     <span className="text-xs text-muted-foreground">
//                       {idea.category.name}
//                     </span>
//                     <span className="text-muted-foreground/40 text-xs">·</span>
//                     <span className="text-xs text-muted-foreground">
//                       {format(new Date(idea.createdAt), "dd MMM yyyy")}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-1.5 shrink-0">
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="h-7 text-xs text-green-700 border-green-300 hover:bg-green-50 dark:hover:bg-green-950"
//                     onClick={() => setApproveTarget(idea)}
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
//                     onClick={() => {
//                       setRejectTarget(idea);
//                       setFeedback("");
//                     }}
//                   >
//                     Reject
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Approve dialog */}
//       <AlertDialog
//         open={!!approveTarget}
//         onOpenChange={(o) => !isApproving && !o && setApproveTarget(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Approve this idea?</AlertDialogTitle>
//             <AlertDialogDescription>
//               <span className="font-medium text-foreground">
//                 &ldquo;{approveTarget?.title}&rdquo;
//               </span>{" "}
//               will become publicly visible on the platform.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel disabled={isApproving}>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-green-600 hover:bg-green-700 text-white"
//               onClick={handleApprove}
//               disabled={isApproving}
//             >
//               {isApproving ? "Approving..." : "Approve"}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Reject dialog */}
//       <Dialog
//         open={!!rejectTarget}
//         onOpenChange={(o) => !isRejecting && !o && setRejectTarget(null)}
//       >
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Reject idea</DialogTitle>
//             <DialogDescription>
//               Provide feedback — visible only to the submitter.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="space-y-3 py-1">
//             <div className="rounded-lg bg-muted/50 px-3 py-2">
//               <p className="text-sm font-medium line-clamp-2">
//                 {rejectTarget?.title}
//               </p>
//               <p className="text-xs text-muted-foreground mt-0.5">
//                 by {rejectTarget?.author.name}
//               </p>
//             </div>
//             <div className="space-y-1.5">
//               <Label htmlFor="feedback" className="text-sm">
//                 Rejection reason <span className="text-destructive">*</span>
//               </Label>
//               <Textarea
//                 id="feedback"
//                 rows={4}
//                 placeholder='e.g. "This idea lacks a feasibility study. Please add cost analysis before resubmitting."'
//                 value={feedback}
//                 onChange={(e) => setFeedback(e.target.value)}
//               />
//               {feedback.length > 0 && feedback.trim().length < 10 && (
//                 <p className="text-xs text-destructive">
//                   Please provide more detailed feedback (min 10 characters)
//                 </p>
//               )}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setRejectTarget(null)}
//               disabled={isRejecting}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               disabled={isRejecting || feedback.trim().length < 10}
//               onClick={handleReject}
//             >
//               {isRejecting ? "Rejecting..." : "Confirm reject"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

"use client";

import {
  approveIdeaAction,
  getAdminStatsAction,
  rejectIdeaAction,
} from "@/app/admin/_action";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminDashboardStats, AdminPendingIdea } from "@/types/api.types";
import { format } from "date-fns";
import { CheckCircle2, Loader2, MessageSquare, XCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface PendingIdeasListProps {
  initialIdeas: AdminPendingIdea[];
  onStatsRefresh?: (stats: AdminDashboardStats) => void;
}

export function PendingIdeasList({
  initialIdeas,
  onStatsRefresh,
}: PendingIdeasListProps) {
  const [ideas, setIdeas] = useState<AdminPendingIdea[]>(initialIdeas);
  const [approveTarget, setApproveTarget] = useState<AdminPendingIdea | null>(
    null,
  );
  const [rejectTarget, setRejectTarget] = useState<AdminPendingIdea | null>(
    null,
  );
  const [feedback, setFeedback] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [isApproving, startApproving] = useTransition();
  const [isRejecting, startRejecting] = useTransition();

  function removeIdea(id: string) {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }

  async function refreshStats() {
    if (!onStatsRefresh) return;
    try {
      const fresh = await getAdminStatsAction();
      onStatsRefresh(fresh);
    } catch {
      // silently fail
    }
  }

  function handleApprove() {
    if (!approveTarget) return;
    const id = approveTarget.id;
    setApprovingId(id);
    startApproving(async () => {
      const result = await approveIdeaAction(id);
      setApproveTarget(null);
      setApprovingId(null);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Idea approved!");
      removeIdea(id);
      refreshStats();
    });
  }

  function handleReject() {
    if (!rejectTarget || feedback.trim().length < 10) return;
    const id = rejectTarget.id;
    setRejectingId(id);
    startRejecting(async () => {
      const result = await rejectIdeaAction(id, feedback.trim());
      setRejectTarget(null);
      setRejectingId(null);
      setFeedback("");
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Idea rejected with feedback.");
      removeIdea(id);
      refreshStats();
    });
  }

  return (
    <>
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[13px] font-semibold text-foreground">
              Pending review
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Approve or reject submitted ideas
            </p>
          </div>
          <Badge className="bg-amber-100 text-amber-800 border-transparent dark:bg-amber-900/30 dark:text-amber-400 text-[11px] font-medium">
            {ideas.length} pending
          </Badge>
        </div>

        {ideas.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-[13px] font-medium">All caught up!</p>
            <p className="text-[12px] text-muted-foreground">
              No ideas waiting for review
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {ideas.map((idea) => {
              const isThisApproving = approvingId === idea.id && isApproving;
              const isThisRejecting = rejectingId === idea.id && isRejecting;
              const isThisBusy = isThisApproving || isThisRejecting;

              return (
                <div
                  key={idea.id}
                  className="py-3 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium line-clamp-1 leading-snug">
                      {idea.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">
                        {idea.author.name}
                      </span>
                      <span className="text-muted-foreground/30 text-[11px]">
                        ·
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {idea.category.name}
                      </span>
                      <span className="text-muted-foreground/30 text-[11px]">
                        ·
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {format(new Date(idea.createdAt), "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    {/* Approve */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-[12px] gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 disabled:opacity-60"
                      disabled={isThisBusy || isApproving || isRejecting}
                      onClick={() => setApproveTarget(idea)}
                    >
                      {isThisApproving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {isThisApproving ? "Approving…" : "Approve"}
                    </Button>

                    {/* Reject */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-[12px] gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 disabled:opacity-60"
                      disabled={isThisBusy || isApproving || isRejecting}
                      onClick={() => {
                        setRejectTarget(idea);
                        setFeedback("");
                      }}
                    >
                      {isThisRejecting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {isThisRejecting ? "Rejecting…" : "Reject"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approve confirm */}
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
              Provide feedback — visible only to the submitter.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="rounded-lg bg-muted/50 px-3 py-2.5">
              <p className="text-[13px] font-medium line-clamp-2">
                {rejectTarget?.title}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                by {rejectTarget?.author.name}
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
                placeholder='e.g. "This idea lacks a feasibility study. Please add cost analysis before resubmitting."'
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              {feedback.length > 0 && feedback.trim().length < 10 && (
                <p className="text-[11px] text-destructive">
                  Please provide more detailed feedback (min 10 characters)
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[13px] gap-1.5"
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
    </>
  );
}
